import { serve } from 'https://deno.land/std@0.170.0/http/server.ts'
import { v4 as uuidv4 } from 'https://esm.sh/uuid'
import 'https://deno.land/x/xhr@0.2.1/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import { codeBlock, oneLine } from 'https://esm.sh/common-tags@1.8.2'
import {
  Configuration,
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
      throw new Error('Missing request body')
    }

    const { filename, data } = requestData

    if (!data) {
      throw new Error('Missing data in request body')
    }

    const sanitizedData = data.trim()
    
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseServiceKey,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Set the Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    const {
      data: { user: user },
    } = await supabaseClient.auth.getUser()

    const configuration = new Configuration({ apiKey: openAiKey })
    const openai = new OpenAIApi(configuration)

    // // Moderate the content to comply with OpenAI T&C
    // const moderationResponse = await openai.createModeration({ input: sanitizedData })

    // const [results] = moderationResponse.data.results

    // if (results.flagged) {
    //   throw new Error('Flagged content', {
    //     flagged: true,
    //     categories: results.categories,
    //   })
    // }

    const datasetUid = uuidv4();
    const { error: upsertDatasetError, data: dataset } = await supabaseClient
      .from('dataset')
      .upsert({
        dataset_uid: datasetUid,
        user_id: user.id,
        name: filename,
        checksum: null
      })
      .select()
      .limit(1)
      .single()

    if (upsertDatasetError) {
      throw new Error('Failed to store dataset' + upsertDatasetError.message)
    }
    // Intentionally log the query
    console.log(upsertDatasetError.message)
    
    const arrayCsv = sanitizedData.split('\n')
    const header = arrayCsv[0].split(',')
    const contentArray = arrayCsv.map((line, index) => {
      if (index > 0) {
        const content = line.split(',')
        return header.reduce((acc, currHead, i) => acc + ';' + currHead + '=' + content[i], '')
      }
    })
    


    const embeddingResponse = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: contentArray,
    })

    if (embeddingResponse.status !== 200) {
      throw new Error('Failed to create embedding for question', embeddingResponse)
    }

    const embeddingList = embeddingResponse.data
    const dbInputList = embeddingList.map((embed, i) => ({
      dataset_uid: datasetUid,
      content: contentArray[i],
      embedding: embed.embedding
    }))
    
    const { error: upsertDatasetRowsError, data: datasetRows } = await supabaseClient
      .from('dataset_rows')
      .upsert(dbInputList)
      .select()

    if (upsertDatasetRowsError) {
      throw new Error('Failed to store dataset rows', upsertDatasetRowsError)
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (err: unknown) {
    if (err instanceof Error) {
      return new Response(
        JSON.stringify({
          error: err.message,
          data: err.data,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } else if (err instanceof Error) {
      // Print out application errors with their additional data
      console.error(`${err.message}: ${JSON.stringify(err.data)}`)
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