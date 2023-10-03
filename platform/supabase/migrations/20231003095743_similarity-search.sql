create or replace function match_dataset_rows(embedding vector(1536), match_threshold float, match_count int, min_content_length int)
returns table (content text, similarity float)
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select
    dataset_rows.content,
    (dataset_rows.embedding <#> embedding) * -1 as similarity
  from dataset_rows
  join dataset
    on dataset_rows.dataset_uid = dataset.id

  -- The dot product is negative because of a Postgres limitation, so we negate it
  and (dataset_rows.embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by dataset_rows.embedding <#> embedding
  
  limit match_count;
end;
$$;