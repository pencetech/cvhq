CREATE OR REPLACE FUNCTION "public"."get_bio_posting"("user_id_input" "uuid", "profile_id_input" bigint) RETURNS TABLE("user_first_name" "text", "user_last_name" "text", "user_email" "text", "user_phone" "text", "user_address" "text", "job_title" "text", "job_company" "text", "job_sector" "text", "job_requirements" "text", "job_add_on" "text")
    LANGUAGE "sql"
    AS $$
  SELECT
  user_bio.first_name,
  user_bio.last_name,
  user_bio.email,
  user_bio.phone,
  user_bio.address,
  job_posting.title,
  job_posting.company,
  job_posting.sector,
  job_posting.requirements,
  job_posting.add_on
  FROM user_bio
  JOIN cv_profile ON cv_profile.id = user_bio.profile_id
  JOIN job_posting ON job_posting.profile_id = cv_profile.id
  WHERE cv_profile.user_id = user_id_input
  AND cv_profile.id = profile_id_input
$$;

ALTER FUNCTION "public"."get_bio_posting"("user_id_input" "uuid", "profile_id_input" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_education"("user_id_input" "uuid", "profile_id_input" bigint) RETURNS TABLE("ed_subject" "text", "ed_institution" "text", "ed_degree" "text", "ed_start_date" timestamp with time zone, "ed_end_date" timestamp with time zone)
    LANGUAGE "sql"
    AS $$
  SELECT
    subject,
    institution,
    degree,
    start_date,
    end_date
  FROM education
  JOIN cv_profile ON cv_profile.id = education.profile_id
  WHERE cv_profile.user_id = user_id_input
  AND cv_profile.id = profile_id_input;
$$;

ALTER FUNCTION "public"."get_education"("user_id_input" "uuid", "profile_id_input" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_experience"("user_id_input" "uuid", "profile_id_input" bigint) RETURNS TABLE("exp_title" "text", "exp_company" "text", "exp_sector" "text", "exp_is_current" boolean, "exp_start_date" timestamp with time zone, "exp_end_date" timestamp with time zone, "exp_achievements" "text")
    LANGUAGE "sql"
    AS $$
  SELECT
  experience.title,
  experience.company,
  experience.sector,
  experience.is_current,
  experience.start_date,
  experience.end_date,
  experience.achievements
  FROM experience
  JOIN cv_profile ON cv_profile.id = experience.profile_id
  WHERE cv_profile.user_id = user_id_input
  AND cv_profile.id = profile_id_input;
$$;

ALTER FUNCTION "public"."get_experience"("user_id_input" "uuid", "profile_id_input" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_file_list_of_user"("user_id_input" "uuid") RETURNS TABLE("filename" "text", "job_title" "text", "job_company" "text")
    LANGUAGE "sql"
    AS $$
  SELECT
  cv_file.filename,
  job_posting.title,
  job_posting.company
  FROM cv_file
  JOIN cv_profile ON cv_profile.id = cv_file.profile_id
  JOIN job_posting ON job_posting.profile_id = cv_profile.id
  WHERE cv_profile.user_id = user_id_input;
$$;

ALTER FUNCTION "public"."get_file_list_of_user"("user_id_input" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_profiles_of_user_time_name"("user_id_input" "uuid") RETURNS TABLE("profile_id" bigint, "profile_name" "text", "inserted_at" timestamp with time zone)
    LANGUAGE "sql"
    AS $$
  SELECT
  cv_profile.id,
  cv_profile.name,
  cv_profile.inserted_at
  FROM cv_profile
  WHERE cv_profile.user_id = user_id_input;
$$;

ALTER FUNCTION "public"."get_profiles_of_user_time_name"("user_id_input" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_skillset"("user_id_input" "uuid", "profile_id_input" bigint) RETURNS TABLE("skillset" "text")
    LANGUAGE "sql"
    AS $$
  SELECT
  skillsets
  FROM skillset
  JOIN cv_profile ON cv_profile.id = skillset.profile_id
  WHERE cv_profile.user_id = user_id_input
  AND cv_profile.id = profile_id_input;
$$;

ALTER FUNCTION "public"."get_skillset"("user_id_input" "uuid", "profile_id_input" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."insert_cv_file_of_profile"("user_id_input" "uuid", "filename_input" "text") RETURNS "void"
    LANGUAGE "sql"
    AS $$INSERT INTO cv_file (
  profile_id,
  filename
) VALUES (
  (SELECT id from cv_profile where user_id = user_id_input),
  filename_input
)$$;

ALTER FUNCTION "public"."insert_cv_file_of_profile"("user_id_input" "uuid", "filename_input" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."insert_education_of_profile"("user_id_input" "uuid", "ed_subject" "text", "ed_institution" "text", "ed_degree" "text", "ed_start_date" timestamp with time zone, "ed_end_date" timestamp with time zone) RETURNS "void"
    LANGUAGE "sql"
    AS $$INSERT INTO education (
  profile_id,
  subject,
  institution,
  degree,
  start_date,
  end_date
) values (
  (SELECT id from cv_profile where user_id = user_id_input),
  ed_subject,
  ed_institution,
  ed_degree,
  ed_start_date,
  ed_end_date
);$$;

ALTER FUNCTION "public"."insert_education_of_profile"("user_id_input" "uuid", "ed_subject" "text", "ed_institution" "text", "ed_degree" "text", "ed_start_date" timestamp with time zone, "ed_end_date" timestamp with time zone) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."insert_experience_of_profile"("user_id_input" "uuid", "exp_title" "text", "exp_company" "text", "exp_sector" "text", "exp_is_current" boolean, "exp_start_date" timestamp with time zone, "exp_achievements" "text", "exp_end_date" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS "void"
    LANGUAGE "sql"
    AS $$
  INSERT INTO experience (
  profile_id,
  title,
  company,
  sector,
  is_current,
  start_date,
  end_date,
  achievements
) VALUES (
  (SELECT id from cv_profile where user_id = user_id_input),
  exp_title,
  exp_company,
  exp_sector,
  exp_is_current,
  exp_start_date,
  exp_end_date,
  exp_achievements
);
$$;

ALTER FUNCTION "public"."insert_experience_of_profile"("user_id_input" "uuid", "exp_title" "text", "exp_company" "text", "exp_sector" "text", "exp_is_current" boolean, "exp_start_date" timestamp with time zone, "exp_achievements" "text", "exp_end_date" timestamp with time zone) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."insert_new_user_profile_job_posting"("profile_user_id" "uuid", "user_first_name" "text", "user_last_name" "text", "user_email" "text", "user_phone" "text", "user_address" "text", "job_title" "text", "job_company" "text", "job_sector" "text", "job_requirements" "text", "job_add_on" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "sql"
    AS $$
INSERT INTO cv_profile (user_id)
VALUES (profile_user_id);
INSERT INTO user_bio (profile_id, first_name, last_name, email, phone, address)
VALUES (
  (SELECT id from cv_profile where user_id = profile_user_id),
  user_first_name,
  user_last_name,
  user_email,
  user_phone,
  user_address
);
INSERT INTO job_posting (profile_id, title, company, sector, requirements, add_on)
VALUES (
  (SELECT id from cv_profile where user_id = profile_user_id),
  job_title,
  job_company,
  job_sector,
  job_requirements,
  job_add_on
);
$$;

ALTER FUNCTION "public"."insert_new_user_profile_job_posting"("profile_user_id" "uuid", "user_first_name" "text", "user_last_name" "text", "user_email" "text", "user_phone" "text", "user_address" "text", "job_title" "text", "job_company" "text", "job_sector" "text", "job_requirements" "text", "job_add_on" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."insert_skillsets_of_profile"("user_id_input" "uuid", "skillsets_input" "text") RETURNS "void"
    LANGUAGE "sql"
    AS $$INSERT INTO skillset (
  profile_id,
  skillsets
) VALUES (
  (SELECT id from cv_profile where user_id = user_id_input),
  skillsets_input
)$$;

ALTER FUNCTION "public"."insert_skillsets_of_profile"("user_id_input" "uuid", "skillsets_input" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."migrate_new_profile_data"("user_id_input" "uuid", "prev_profile_id_input" bigint, "curr_profile_id_input" bigint) RETURNS "void"
    LANGUAGE "sql"
    AS $$
INSERT INTO education (
  profile_id,
  seq_id,
  subject,
  institution,
  degree,
  start_date,
  end_date
) SELECT
    curr_profile_id_input,
    seq_id,
    subject,
    institution,
    degree,
    start_date,
    end_date
  FROM education
  JOIN cv_profile ON cv_profile.id = education.profile_id
  WHERE cv_profile.user_id = user_id_input
  AND cv_profile.id = prev_profile_id_input;

INSERT INTO experience (
  profile_id,
  seq_id,
  title,
  company,
  sector,
  is_current,
  start_date,
  end_date,
  achievements
) SELECT
    curr_profile_id_input,
    seq_id,
    title,
    company,
    sector,
    is_current,
    start_date,
    end_date,
    achievements
  FROM experience
  JOIN cv_profile ON cv_profile.id = experience.profile_id
  WHERE cv_profile.user_id = user_id_input
  AND cv_profile.id = prev_profile_id_input;

INSERT INTO skillset (
  profile_id,
  skillsets
) SELECT
    curr_profile_id_input,
    skillsets
  FROM skillset
  JOIN cv_profile ON cv_profile.id = skillset.profile_id
  WHERE cv_profile.user_id = user_id_input
  AND cv_profile.id = prev_profile_id_input;
$$;

ALTER FUNCTION "public"."migrate_new_profile_data"("user_id_input" "uuid", "prev_profile_id_input" bigint, "curr_profile_id_input" bigint) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE "public"."cv_file" (
    "id" bigint NOT NULL,
    "profile_id" bigint NOT NULL,
    "inserted_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "filename" "text" NOT NULL
);

ALTER TABLE "public"."cv_file" OWNER TO "postgres";

ALTER TABLE "public"."cv_file" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."cv_file_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE "public"."cv_profile" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "inserted_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "name" "text" NOT NULL
);

ALTER TABLE "public"."cv_profile" OWNER TO "postgres";

ALTER TABLE "public"."cv_profile" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."cv_profile_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE "public"."education" (
    "id" bigint NOT NULL,
    "inserted_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "subject" "text" NOT NULL,
    "institution" "text" NOT NULL,
    "degree" "text" NOT NULL,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "profile_id" bigint NOT NULL,
    "seq_id" bigint NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."education" OWNER TO "postgres";

ALTER TABLE "public"."education" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."education_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE "public"."experience" (
    "id" bigint NOT NULL,
    "inserted_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "title" "text" NOT NULL,
    "company" "text" NOT NULL,
    "sector" "text" NOT NULL,
    "is_current" boolean NOT NULL,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone,
    "achievements" "text" NOT NULL,
    "profile_id" bigint NOT NULL,
    "seq_id" bigint NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."experience" OWNER TO "postgres";

ALTER TABLE "public"."experience" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."experience_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE "public"."job_posting" (
    "id" bigint NOT NULL,
    "inserted_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "title" "text" NOT NULL,
    "company" "text" NOT NULL,
    "sector" "text" NOT NULL,
    "requirements" "text" NOT NULL,
    "add_on" "text",
    "profile_id" bigint NOT NULL
);

ALTER TABLE "public"."job_posting" OWNER TO "postgres";

ALTER TABLE "public"."job_posting" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."job_posting_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "website" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE "public"."skillset" (
    "id" bigint NOT NULL,
    "inserted_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "skillsets" "text" NOT NULL,
    "profile_id" bigint NOT NULL
);

ALTER TABLE "public"."skillset" OWNER TO "postgres";

ALTER TABLE "public"."skillset" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."skillset_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE "public"."user_bio" (
    "id" bigint NOT NULL,
    "inserted_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "email" "text" NOT NULL,
    "address" "text" NOT NULL,
    "user_id" "uuid"
);

ALTER TABLE "public"."user_bio" OWNER TO "postgres";

ALTER TABLE "public"."user_bio" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_bio_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."cv_file"
    ADD CONSTRAINT "cv_file_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."cv_profile"
    ADD CONSTRAINT "cv_profile_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."education"
    ADD CONSTRAINT "education_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."experience"
    ADD CONSTRAINT "experience_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."job_posting"
    ADD CONSTRAINT "job_posting_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."skillset"
    ADD CONSTRAINT "skillset_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."education"
    ADD CONSTRAINT "unique_ed_prof_seq_id" UNIQUE ("profile_id", "seq_id");

ALTER TABLE ONLY "public"."experience"
    ADD CONSTRAINT "unique_exp_prof_seq_id" UNIQUE ("profile_id", "seq_id");

ALTER TABLE ONLY "public"."job_posting"
    ADD CONSTRAINT "unique_posting_profile_id" UNIQUE ("profile_id");

ALTER TABLE ONLY "public"."skillset"
    ADD CONSTRAINT "unique_skillset_profile_id" UNIQUE ("profile_id");

ALTER TABLE ONLY "public"."user_bio"
    ADD CONSTRAINT "unique_user_bio_user_id" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."cv_profile"
    ADD CONSTRAINT "unique_user_profile_name" UNIQUE ("user_id", "name");

ALTER TABLE ONLY "public"."user_bio"
    ADD CONSTRAINT "user_bio_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."education"
    ADD CONSTRAINT "fk_education_profile_id" FOREIGN KEY ("profile_id") REFERENCES "public"."cv_profile"("id");

ALTER TABLE ONLY "public"."experience"
    ADD CONSTRAINT "fk_experience_profile_id" FOREIGN KEY ("profile_id") REFERENCES "public"."cv_profile"("id");

ALTER TABLE ONLY "public"."job_posting"
    ADD CONSTRAINT "fk_job_posting_profile_id" FOREIGN KEY ("profile_id") REFERENCES "public"."cv_profile"("id");

ALTER TABLE ONLY "public"."skillset"
    ADD CONSTRAINT "fk_skillset_profile_id" FOREIGN KEY ("profile_id") REFERENCES "public"."cv_profile"("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."user_bio"
    ADD CONSTRAINT "user_bio_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);

CREATE POLICY "Users can insert their own cv file." ON "public"."cv_file" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "cv_file"."profile_id"))));

CREATE POLICY "Users can insert their own education." ON "public"."education" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "education"."profile_id"))));

CREATE POLICY "Users can insert their own experience." ON "public"."experience" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "experience"."profile_id"))));

CREATE POLICY "Users can insert their own job posting." ON "public"."job_posting" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "job_posting"."profile_id"))));

CREATE POLICY "Users can insert their own profile." ON "public"."cv_profile" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Users can insert their own skillset." ON "public"."skillset" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "skillset"."profile_id"))));

CREATE POLICY "Users can insert their own user bio." ON "public"."user_bio" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));

CREATE POLICY "Users can update their own CVs." ON "public"."cv_file" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "cv_file"."profile_id"))));

CREATE POLICY "Users can update their own education." ON "public"."education" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "education"."profile_id"))));

CREATE POLICY "Users can update their own experience." ON "public"."experience" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "experience"."profile_id"))));

CREATE POLICY "Users can update their own job_posting." ON "public"."job_posting" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "job_posting"."profile_id"))));

CREATE POLICY "Users can update their own profile." ON "public"."cv_profile" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Users can update their own skillsets." ON "public"."skillset" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "skillset"."profile_id"))));

CREATE POLICY "Users can update their own user bio." ON "public"."user_bio" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Users can view their own CVs." ON "public"."cv_file" FOR SELECT USING (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "cv_file"."profile_id"))));

CREATE POLICY "Users can view their own education." ON "public"."education" FOR SELECT USING (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "education"."profile_id"))));

CREATE POLICY "Users can view their own experience." ON "public"."experience" FOR SELECT USING (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "experience"."profile_id"))));

CREATE POLICY "Users can view their own profiles." ON "public"."cv_profile" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Users can view their own skillset." ON "public"."skillset" FOR SELECT USING (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "skillset"."profile_id"))));

CREATE POLICY "Users can view their own user bio." ON "public"."job_posting" FOR SELECT USING (("auth"."uid"() IN ( SELECT "cv_profile"."user_id"
   FROM "public"."cv_profile"
  WHERE ("cv_profile"."id" = "job_posting"."profile_id"))));

CREATE POLICY "Users can view their own user bio." ON "public"."user_bio" FOR SELECT USING (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."cv_file" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."cv_profile" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."education" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."experience" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."job_posting" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."skillset" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_bio" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "extensions" TO "anon";
GRANT USAGE ON SCHEMA "extensions" TO "authenticated";
GRANT USAGE ON SCHEMA "extensions" TO "service_role";
GRANT ALL ON SCHEMA "extensions" TO "dashboard_user";

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."grant_pg_cron_access"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."grant_pg_cron_access"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."grant_pg_cron_access"() TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."grant_pg_graphql_access"() TO "postgres" WITH GRANT OPTION;

REVOKE ALL ON FUNCTION "extensions"."grant_pg_net_access"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."grant_pg_net_access"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."grant_pg_net_access"() TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision) TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."pgrst_ddl_watch"() TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."pgrst_drop_watch"() TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."set_graphql_placeholder"() TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "postgres";
GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "anon";
GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "authenticated";
GRANT ALL ON FUNCTION "graphql"."comment_directive"("comment_" "text") TO "service_role";

GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "postgres";
GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "anon";
GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "authenticated";
GRANT ALL ON FUNCTION "graphql"."exception"("message" "text") TO "service_role";

GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "postgres";
GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "anon";
GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "authenticated";
GRANT ALL ON FUNCTION "graphql"."get_schema_version"() TO "service_role";

GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "postgres";
GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "anon";
GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "authenticated";
GRANT ALL ON FUNCTION "graphql"."increment_schema_version"() TO "service_role";

GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea") TO "service_role";

GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea") TO "service_role";

GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_keygen"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_bio_posting"("user_id_input" "uuid", "profile_id_input" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_bio_posting"("user_id_input" "uuid", "profile_id_input" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_bio_posting"("user_id_input" "uuid", "profile_id_input" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_education"("user_id_input" "uuid", "profile_id_input" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_education"("user_id_input" "uuid", "profile_id_input" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_education"("user_id_input" "uuid", "profile_id_input" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_experience"("user_id_input" "uuid", "profile_id_input" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_experience"("user_id_input" "uuid", "profile_id_input" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_experience"("user_id_input" "uuid", "profile_id_input" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_file_list_of_user"("user_id_input" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_file_list_of_user"("user_id_input" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_file_list_of_user"("user_id_input" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_profiles_of_user_time_name"("user_id_input" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_profiles_of_user_time_name"("user_id_input" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profiles_of_user_time_name"("user_id_input" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_skillset"("user_id_input" "uuid", "profile_id_input" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_skillset"("user_id_input" "uuid", "profile_id_input" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_skillset"("user_id_input" "uuid", "profile_id_input" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."insert_cv_file_of_profile"("user_id_input" "uuid", "filename_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."insert_cv_file_of_profile"("user_id_input" "uuid", "filename_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_cv_file_of_profile"("user_id_input" "uuid", "filename_input" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."insert_education_of_profile"("user_id_input" "uuid", "ed_subject" "text", "ed_institution" "text", "ed_degree" "text", "ed_start_date" timestamp with time zone, "ed_end_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."insert_education_of_profile"("user_id_input" "uuid", "ed_subject" "text", "ed_institution" "text", "ed_degree" "text", "ed_start_date" timestamp with time zone, "ed_end_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_education_of_profile"("user_id_input" "uuid", "ed_subject" "text", "ed_institution" "text", "ed_degree" "text", "ed_start_date" timestamp with time zone, "ed_end_date" timestamp with time zone) TO "service_role";

GRANT ALL ON FUNCTION "public"."insert_experience_of_profile"("user_id_input" "uuid", "exp_title" "text", "exp_company" "text", "exp_sector" "text", "exp_is_current" boolean, "exp_start_date" timestamp with time zone, "exp_achievements" "text", "exp_end_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."insert_experience_of_profile"("user_id_input" "uuid", "exp_title" "text", "exp_company" "text", "exp_sector" "text", "exp_is_current" boolean, "exp_start_date" timestamp with time zone, "exp_achievements" "text", "exp_end_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_experience_of_profile"("user_id_input" "uuid", "exp_title" "text", "exp_company" "text", "exp_sector" "text", "exp_is_current" boolean, "exp_start_date" timestamp with time zone, "exp_achievements" "text", "exp_end_date" timestamp with time zone) TO "service_role";

GRANT ALL ON FUNCTION "public"."insert_new_user_profile_job_posting"("profile_user_id" "uuid", "user_first_name" "text", "user_last_name" "text", "user_email" "text", "user_phone" "text", "user_address" "text", "job_title" "text", "job_company" "text", "job_sector" "text", "job_requirements" "text", "job_add_on" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."insert_new_user_profile_job_posting"("profile_user_id" "uuid", "user_first_name" "text", "user_last_name" "text", "user_email" "text", "user_phone" "text", "user_address" "text", "job_title" "text", "job_company" "text", "job_sector" "text", "job_requirements" "text", "job_add_on" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_new_user_profile_job_posting"("profile_user_id" "uuid", "user_first_name" "text", "user_last_name" "text", "user_email" "text", "user_phone" "text", "user_address" "text", "job_title" "text", "job_company" "text", "job_sector" "text", "job_requirements" "text", "job_add_on" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."insert_skillsets_of_profile"("user_id_input" "uuid", "skillsets_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."insert_skillsets_of_profile"("user_id_input" "uuid", "skillsets_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_skillsets_of_profile"("user_id_input" "uuid", "skillsets_input" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."migrate_new_profile_data"("user_id_input" "uuid", "prev_profile_id_input" bigint, "curr_profile_id_input" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."migrate_new_profile_data"("user_id_input" "uuid", "prev_profile_id_input" bigint, "curr_profile_id_input" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."migrate_new_profile_data"("user_id_input" "uuid", "prev_profile_id_input" bigint, "curr_profile_id_input" bigint) TO "service_role";

GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";

GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "dashboard_user";

GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "postgres";
GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "anon";
GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "authenticated";
GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "service_role";

GRANT ALL ON TABLE "pgsodium"."decrypted_key" TO "pgsodium_keyholder";

GRANT ALL ON TABLE "pgsodium"."masking_rule" TO "pgsodium_keyholder";

GRANT ALL ON TABLE "pgsodium"."mask_columns" TO "pgsodium_keyholder";

GRANT ALL ON TABLE "public"."cv_file" TO "anon";
GRANT ALL ON TABLE "public"."cv_file" TO "authenticated";
GRANT ALL ON TABLE "public"."cv_file" TO "service_role";

GRANT ALL ON SEQUENCE "public"."cv_file_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cv_file_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cv_file_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."cv_profile" TO "anon";
GRANT ALL ON TABLE "public"."cv_profile" TO "authenticated";
GRANT ALL ON TABLE "public"."cv_profile" TO "service_role";

GRANT ALL ON SEQUENCE "public"."cv_profile_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cv_profile_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cv_profile_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."education" TO "anon";
GRANT ALL ON TABLE "public"."education" TO "authenticated";
GRANT ALL ON TABLE "public"."education" TO "service_role";

GRANT ALL ON SEQUENCE "public"."education_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."education_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."education_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."experience" TO "anon";
GRANT ALL ON TABLE "public"."experience" TO "authenticated";
GRANT ALL ON TABLE "public"."experience" TO "service_role";

GRANT ALL ON SEQUENCE "public"."experience_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."experience_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."experience_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."job_posting" TO "anon";
GRANT ALL ON TABLE "public"."job_posting" TO "authenticated";
GRANT ALL ON TABLE "public"."job_posting" TO "service_role";

GRANT ALL ON SEQUENCE "public"."job_posting_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."job_posting_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."job_posting_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."skillset" TO "anon";
GRANT ALL ON TABLE "public"."skillset" TO "authenticated";
GRANT ALL ON TABLE "public"."skillset" TO "service_role";

GRANT ALL ON SEQUENCE "public"."skillset_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."skillset_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."skillset_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."user_bio" TO "anon";
GRANT ALL ON TABLE "public"."user_bio" TO "authenticated";
GRANT ALL ON TABLE "public"."user_bio" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_bio_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_bio_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_bio_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
