import { serve } from 'https://deno.land/std@0.170.0/http/server.ts'
import 'https://deno.land/x/xhr@0.2.1/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'
import { codeBlock, oneLine } from 'https://esm.sh/common-tags@1.8.2'
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from 'https://esm.sh/openai@3.2.1'

const openAiKey = Deno.env.get('OPENAI_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    if (!openAiKey) {
      throw new Error('Missing environment variable OPENAI_KEY')
    }

    if (!supabaseUrl) {
      throw new Error('Missing environment variable SUPABASE_URL')
    }

    if (!supabaseServiceKey) {
      throw new Error('Missing environment variable SUPABASE_SERVICE_ROLE_KEY')
    }

    const requestData = await req.json()

    if (!requestData) {
      throw new Error('Missing request data')
    }

    const { query } = requestData

    if (!query) {
      throw new Error('Missing query in request data')
    }

    // Intentionally log the query
    console.log({ query })

    const sanitizedQuery = query.trim()

    const supabaseClient = createClient(
      supabaseUrl, 
      supabaseServiceKey,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const configuration = new Configuration({ apiKey: openAiKey })
    const openai = new OpenAIApi(configuration)

    const hydeMessages: ChatCompletionRequestMessage[] = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: codeBlock`
          ${oneLine`
            You are a very enthusiastic data scientist in a company who loves
            to help people! Given the following question, generate a hypothetical answer 
            in the form of a matching entry in the database following this exact format:
          `}

          ${oneLine`
          customer=CUSTOMER;age=AGE;merchant=MERCHANT;category=CATEGORY;amount=AMOUNT;fraud=FRAUD;status=STATUS;timestamp=TIMESTAMP;payment_method=PAYMENT_METHOD
          `}

          ${oneLine`
          Pretend you have all the information you need to answer, 
          but don't use any actual facts other than the one provided in the question. Instead,
          use placeholders like CATEGORY or AGE.
          `}
        `,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: codeBlock`
          Here is the question:
          ${sanitizedQuery}

          ${oneLine`
            Make sure to return in text format.
          `}
        `,
      }
    ]

    const hydeCompletionOptions: CreateChatCompletionRequest = {
      model: 'gpt-4',
      messages: hydeMessages,
      max_tokens: 1024,
      temperature: 0,
      stream: false,
    }

    const hydeResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(hydeCompletionOptions),
    })

    if (!hydeResponse.ok) {
      const error = await hydeResponse.json()
      throw new Error('Failed to generate completion', error)
    }

    const jsonResponse = await hydeResponse.json()
    const fakeEntry = jsonResponse.body.choices[0].message.content
    console.log("Fake entry: " + fakeEntry)

    const embeddingResponse = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: fakeEntry.replaceAll('\n', ' '),
    })

    if (embeddingResponse.status !== 200) {
      throw new Error('Failed to create embedding for question')
    }

    const [{ embedding }] = embeddingResponse.data.data

    const { error: matchError, data: pageSections } = await supabaseClient.rpc(
      'match_dataset_rows',
      {
        embedding,
        match_threshold: 0.78,
        match_count: 50,
        min_content_length: 50,
      }
    )

    if (matchError) {
      throw new Error("Failed to match dataset rows: " + matchError.message)
    }

    console.log(pageSections)
    let contextText = '';

    for (let i = 0; i < pageSections.length; i++) {
      const pageSection = pageSections[i]
      const content = pageSection.content

      contextText += `${content.trim()}\n---\n`
    }

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: codeBlock`
          ${oneLine`
            You are a very enthusiastic data scientist in a company who loves
            to help people! Given the following information from
            the company's database, answer the user's question using
            only that information, outputted in markdown format.
          `}

          ${oneLine`
            If you are unsure
            and the answer is not explicitly written in the database, say
            "Sorry, I don't know how to help with that."
          `}
        `,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: codeBlock`
          Here is the database:
          ${contextText}
        `,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: codeBlock`
          ${oneLine`
            Answer my next question using only the above database.
            You must also follow the below rules when answering:
          `}
          ${oneLine`
            - Do not make up answers that are not provided in the database.
          `}
          ${oneLine`
            - If you are unsure and the answer is not explicitly written
            in the database context, say
            "Sorry, I don't know how to help with that."
          `}
          ${oneLine`
            - Prefer splitting your response into multiple paragraphs.
          `}
          ${oneLine`
            - Output as text.
          `}
        `,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: codeBlock`
          Here is my question:
          ${oneLine`${sanitizedQuery}`}
      `,
      },
    ]

    const completionOptions: CreateChatCompletionRequest = {
      model: 'gpt-4',
      messages,
      max_tokens: 1024,
      temperature: 0,
      stream: false,
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(completionOptions),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error('Failed to generate completion', error)
    }

    // Proxy the streamed SSE response from OpenAI
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new Response(
        JSON.stringify({
          error: err.message
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } else {
      // Print out unexpected errors as is to help with debugging
      console.error(err)
    }

    // TODO: include more response info in debug environments
    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})