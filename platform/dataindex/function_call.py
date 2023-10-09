from llama_index import PromptTemplate
from llama_index.llms import OpenAI
from llama_index.program import OpenAIPydanticProgram
from llama_index.query_engine import CustomQueryEngine, BaseQueryEngine
from llama_index.response_synthesizers import TreeSummarize
from pydantic import BaseModel, Field
from typing import List

router_prompt0 = PromptTemplate(
    "Some choices are given below. It is provided in a numbered "
    "list (1 to {num_choices}), "
    "where each item in the list corresponds to a summary.\n"
    "---------------------\n"
    "{context_list}"
    "\n---------------------\n"
    "Using only the choices above and not prior knowledge, return the top choices "
    "(no more than {max_outputs}, but only select what is needed) that "
    "are most relevant to the question: '{query_str}'\n"
)

# Add prompt with the ability to respond with follow up question
# Incorporate the user Id 

choices = [
    "Useful for questions related to transaction status",
    "Useful for when there's not enough information to do the above choices",
]

router_prompt1 = router_prompt0.partial_format(
    num_choices=len(choices),
    max_outputs=len(choices)
)

def get_choice_str(choices):
    choices_str = "\n\n".join([f"{idx+1}. {c}" for idx, c in enumerate(choices)])
    return choices_str


choices_str = get_choice_str(choices)

class Answer(BaseModel):
    "Represents a single choice with a reason." ""
    choice: int
    reason: str

class Answers(BaseModel):
    """Represents a list of answers."""
    answers: List[Answer]

class RouterQueryEngine(CustomQueryEngine):
    """Use our Pydantic program to perform routing"""

    query_engines: List[BaseQueryEngine]
    choice_description: List[str]
    verbose: bool = False
    router_prompt: PromptTemplate
    llm: OpenAI
    summarizer: TreeSummarize = Field(default_factory=TreeSummarize)

    def custom_query(self, query_str: str):
        """Define custom query"""
        program = OpenAIPydanticProgram.from_defaults(
            output_cls=Answers,
            prompt=self.router_prompt,
            verbose=self.verbose,
            llm=self.llm,
        )

        choices_str = get_choice_str(self.choice_description)
        output = program(context_list=choices_str, query_str=query_str)
        # print choice and reason, and query the underlying engine
        if self.verbose:
            print(f"Selected choice(s):")
            for answer in output.answers:
                    print(f"Choice: {answer.choice}, Reason: {answer.reason}")
        responses = []
        for answer in output.answers:
            choice_idx = answer.choice - 1
            query_engine = self.query_engines[choice_idx]
            response = query_engine.query(query_str)
            responses.append(response)
        # If a single choice are picked, we can just return that response
        if len(responses) == 1:
            return responses[0]
        else:
            # If multilpe choices are picked, we can pick a summarizer
            response_strs = [str(r) for r in responses]
            result_response = self.summarizer.get_response(query_str, response_strs)
            return result_response