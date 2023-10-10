import os
from sqlalchemy import create_engine, insert, ForeignKey, MetaData, Table, Column, String, Integer, BigInteger, select, column, text, Boolean
from llama_index import SQLDatabase, VectorStoreIndex, Prompt
from llama_index.objects import SQLTableNodeMapping, ObjectIndex, SQLTableSchema
from llama_index.indices.struct_store import SQLTableRetrieverQueryEngine
from function_call import RouterQueryEngine, choices, router_prompt1
from decouple import config
from rows import customerRows, transactionRows
from flask import Flask, request, jsonify

os.environ["OPENAI_API_KEY"] = config("OPENAI_KEY")
app = Flask(__name__)

@app.route("/query", methods=["GET"])
def query_index():
    engine = create_engine("sqlite:///:memory:")
    metadata_obj = MetaData()

    customer_table_name = "customers"
    customer_table = Table(
        customer_table_name,
        metadata_obj,
        Column("customer_id", Integer, primary_key=True),
        Column("name_customer", String, nullable=False),
        Column("email", String, nullable=False),
        Column("timestamp_created", String, nullable=False),
        Column("fraud_meter", Integer, nullable=False),
        Column("balance_current", Integer, nullable=False),
    )

    transaction_table_name = "transactions"
    transaction_table = Table(
        transaction_table_name,
        metadata_obj,
        Column("transaction_id", String, primary_key=True),
        Column("customer_id", Integer, ForeignKey("customers.customer_id"), nullable=False),
        Column("merchant_id", Integer, nullable=False),
        Column("category", String, nullable=False),
        Column("amount", Integer, nullable=False),
        Column("fraud", Boolean, nullable=False),
        Column("status", String, nullable=False),
        Column("timestamp", String, nullable=False),
        Column("payment_method", String, nullable=False),
    )
    metadata_obj.create_all(engine)

    for row in customerRows:
        stmt = insert(customer_table).values(**row)
        with engine.connect() as connection:
            cursor = connection.execute(stmt)
            connection.commit()

    for row in transactionRows:
        stmt = insert(transaction_table).values(**row)
        with engine.connect() as connection:
            cursor = connection.execute(stmt)
            connection.commit()

    sql_database = SQLDatabase(engine, include_tables=["customers", "transactions"])

    table_node_mapping = SQLTableNodeMapping(sql_database)
    table_schema_objs = [(SQLTableSchema(table_name="customers")), (SQLTableSchema(table_name="transactions"))] # one SQLTableSchema for each table

    obj_index = ObjectIndex.from_objects(
        table_schema_objs,
        table_node_mapping,
        VectorStoreIndex,
    )
    query_text = request.args.get("text", None)
    query_customer = request.args.get("customer_id", None)
    if query_text is None or query_customer is None:
        return "No text found, please include a ?text=blah parameter in the URL", 400
    
    TEMPLATE_STR = (
    "You are a very enthusiastic data scientist in a company who loves to help people!"
    "Given an input question, first create a syntactically correct {dialect} "
    "query to run, then look at the results of the query and return the answer. "
    "You can order the results by a relevant column to return the most "
    "interesting examples in the database.\n\n"
    "Never query for all the columns from a specific table, only ask for a "
    "few relevant columns given the question.\n\n"
    "Pay attention to use only the column names that you can see in the schema "
    "description. "
    "Be careful to not query for columns that do not exist. "
    "Pay attention to which column is in which table. "
    "Also, qualify column names with the table name when needed. "
    "You are required to use the following format, each taking one line:\n\n"
    "Question: Question here\n"
    "SQLQuery: SQL Query to run\n"
    "SQLResult: Result of the SQLQuery\n"
    "Answer: Final answer here\n\n"
    "Only use tables listed below.\n"
    "{schema}\n\n"
    "Question: {query_str}\n"
    "SQLQuery: "
)
    QA_TEMPLATE = Prompt(TEMPLATE_STR)

    query_engine = SQLTableRetrieverQueryEngine(
        sql_database, obj_index.as_retriever(similarity_top_k=1), text_to_sql_prompt=QA_TEMPLATE
        )
    
    enhanced_query_text = query_text + "(customer: " + query_customer + ")"
    
    result = query_engine.query(enhanced_query_text)
    response = jsonify(message=str(result))
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == "__main__":
    # init the global index
    app.run(host="0.0.0.0", port=5601)