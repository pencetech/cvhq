package graph

var CvSummaryPrompt1 = `You are a professional CV and resume coach.
  
Write a biographical resume summary section strictly between 300 and 400 characters with the following profile: "%s",


Make sure to follow these rules and constraints:
1. Do not mention the profile name, first name, last name, or make it into a third-person summary
2. Make sure to match the writings to satisfy the requirements of a potential job with the following detail,: "%s",
3. Do not blindly write the output directly from the potential job details, it will produce untruthful result,
3. do not exceed 400 characters,
4. if there are missing experience or skillset, do not mention it at all. Omit this information from the summary,
5.  Do not mention the profile name, first name, last name, or make it into a third-person summary.
6. Do not mention if this person is seeking a position anywhere
7. Follow this summary format and order: 
what roles are this person excels at, their impact in their past roles and experience (proven track record), their skills, their positive characteristics,
8. do not exceed 400 characters.

`
var CvSummaryPrompt2 = `You are a professional career coach, HR professional, and expert at CV and resume coaching.

Write a well-written and concise professional summary strictly between 300 and 400 characters with the following profile: "

(begin list)
{{ range .CvContent.Experiences }}
- a professional with the role of {{ .Title }}, operating in the {{ .Sector }} field.

- extensive experience such as:
	{{ .Achievements }}.
{{ end }}
(end of list)".

Make sure to follow these rules and constraints:

1.  Read the description previously provided for the person's qualifications, skills, experiences, and achievements thoroughly. 

2. Do not mention the profile name, first name, last name, or make it into a third-person summary

3. Make sure to understand the key points and highlights of the description.

4. Craft a professional summary that effectively showcases the person's expertise and suitability for the desired role, which is : a 
{{ .JobPosting.Title }}
.

5. Keep the summary concise and focused, using clear and concise language.

6. Use proper grammar, punctuation, and sentence structure to ensure a polished and professional summary.

7. Avoid using personal pronouns and maintain a formal tone throughout the summary.

8. Emphasize the person's most relevant qualifications and skills that align with the requirements of the desired role, which is the following: "(begin list) 
{{ .JobPosting.Requirements }}
(end of list)".

9. Highlight key achievements and experiences that demonstrate the person's expertise and success in their field.

10. Ensure that the summary is engaging and captures the attention of potential employers or recruiters.

11. Review and proofread the summary to eliminate any grammatical errors or inconsistencies.

12. Do not blindly write the output directly from the potential job details, it will produce untruthful result,

13. do not exceed 400 characters,

14. if there are missing experience or skillset from the person's profile compared to the desired role, do not mention it at all. Omit this information from the summary.

15.  Do not mention the profile name, first name, last name, or make it into a third-person summary.

16. Do not mention if this person is seeking a position anywhere

17. do not exceed 400 characters.

Remember, the goal is to create a compelling professional summary that stands out and accurately represents the person's qualifications and suitability for the desired role.
`
var CvSummaryPrompt3 = `You are a professional CV and resume coach.
  
Write a biographical resume summary section between 10-20 characters with the following profile: "%s",


Make sure to follow these rules and constraints:
1. Do not mention the profile name, first name, last name, or make it into a third-person summary
2. Make sure to match the writings to satisfy the requirements of a potential job with the following detail,: "%s",
3. Do not blindly write the output directly from the potential job details, it will produce untruthful result,
3. do not exceed 400 characters,
4. if there are missing experience or skillset, do not mention it at all. Omit this information from the summary,
5.  Do not mention the profile name, first name, last name, or make it into a third-person summary.
6. Do not mention if this person is seeking a position anywhere
7. Follow this summary format and order: 
what roles are this person excels at, their impact in their past roles and experience (proven track record), their skills, their positive characteristics,
8. do not exceed 400 characters.

`

var EnhanceAchievementPrompt1 = `You are a professional career coach, HR professional, and expert at CV and resume coaching.

{{ .UserBio.FirstName }} is currently a 
{{ .Experience.Title }}
at a company operating in
{{ .Experience.Sector }}
 sector

 , they need to write a CV for a 

{{ .JobPosting.Title }}


 role at a company operating in 

{{ .JobPosting.Sector }}
 sector.

Task 1: Your task is to help {{ .UserBio.FirstName }} rewrite relevant bullet points experience for their current role at 
{{ .Experience.Title }}
in order to closely match the needed criteria of the new role they're applying for. 

The content has to demonstrate that {{ .UserBio.FirstName }} meets most of the following job requirements: (begin list) " 
{{ .JobPosting.Requirements }}
 " (end of list).

Now, to achieve the above-mentioned objective, follow exactly the following prompt and rules:  

Rule 1: Return the result into the following JSON format: 

 { match: { 

matchFactor: number, reason: string}, 

achievements: string,} 

Where "match" is the overall match factor (0-10) of the job requirements to {{ .UserBio.FirstName }}'s current experience as

{{ .Experience.Title }}
which operates in the sector of 
{{ .Experience.Sector }}
, 

with this listed experience : (begin list)"

{{ .Experience.Achievements }}
 " (end of list).

and "achievements" is the improved and rewritten version of {{ .UserBio.FirstName }}'s experience from Task 1."

Rule 2: "match" has to be a short summary (less than 400 characters) of which key job requirements are either a match or not a match to their current experience.

Rule 3: "achievements" bullet points must contain the impact to the business and can be quantified in a numerical sense. An example of this is (begin list) " - Automated treasury  system saving 70%% time year per year. - Optimised transactions , leading to 50%% cut in data processing time. - Contributed to territory expansion leading to new 100 clients per quarter. - Drove 120%% increased revenue in Finance sector clients." (end of list).

Rule 4: "achievements" doesnt exceed 5 bullet points.

Rule 5: "achievements" must not just duplicate words from the listed job requirements, you'll end up making up things that are not true! 

Rule 6: "achievements" at least 2/3 of the bullet points must contain the impact to the business and can be quantified in a numerical sense. Always include a numeric,percentage, or KPI-specific information. An example of this is (begin list) " - Automated treasury  system saving 70% time year per year. - Optimised transactions , leading to 50%% cut in data processing time. - Contributed to territory expansion leading to new 100 clients per quarter. - Drove 120%% increased revenue in Finance sector clients." (end of list).
`

var EnhanceAchievementPrompt2 = `{{ .UserBio.FirstName }} {{ .UserBio.LastName }} is currently a {{ .Experience.Title }} at {{ .Experience.Company }}, 
	and needs to write a CV for a {{ .JobPosting.Title }} role at {{ .JobPosting.Company }}, a {{ .JobPosting.Sector }} company. 
	Your task is to help improve on {{ .UserBio.FirstName }}'s bullet points for each of his experiences. The content has to 
	demonstrate that {{ .UserBio.FirstName }} meets most of the following job requirements and nice-to-haves: 
	- requirements: "{{ .JobPosting.Requirements }}"
	- nice-to-haves: "{{ .JobPosting.AddOn }}"
	Now, to achieve the abovementioned objective, follow exactly the following: 
	1. Before doing any improvements, state the match factor, an integer from 0-10 of the requirements to {{ .UserBio.FirstName }}'s original or given experience, 
	stating which bullet points do not meet the requirements and the reasons why. 
	2. Here is the list of {{ .UserBio.FirstName }}'s experience: "{{ .Experience.Achievements }}"
	containing the bullet points you need to improve. Return the improved bullet points. Please do the 
	following when you write your bullet points: 
	1. Note that the bullet points should contain not only things being done but also the impact to the business. 
	2. Please don't exceed 5 bullet points. 
	3. Do not just duplicate words from {{ .JobPosting.Company }}'s job requirements, you'll end up making up things that are not true! 
	Here are some examples of bullet points that you can produce for a random software engineer:
	"- Automated treasury reconciliation system by transforming SWIFT messages into a concise report in an internal portal, saving 70%% time
	- Developed alerting system for high-value foreign exchange (FX) transaction to better manage Starling's FX risk
	- Optimised PostgreSQL database transactions to more correctly calculate ledger balances, leading to 50%% cut in data processing time
	- Led collaboration with external partners to build better reporting capability inside Starling, saved months of potential backlog"\n 
	3. Return steps 1 and 2 into the following JSON format:
	{
		match: {
			matchFactor: number,
			reason: string
		},
		achievements: string,
	}
	Where "match" is the overall match of {{ .UserBio.FirstName }}'s achievements to the job requireemnts as stated in step 1, 
	and "achievements" is the improved version of {{ .UserBio.FirstName }}'s achievements as stated in step 2.
`
var EnhanceAchievementPrompt3 = `{{ .UserBio.FirstName }} {{ .UserBio.LastName }} is currently a {{ .Experience.Title }} at {{ .Experience.Company }}, 
	and needs to write a CV for a {{ .JobPosting.Title }} role at {{ .JobPosting.Company }}, a {{ .JobPosting.Sector }} company. 
	Your task is to help improve on {{ .UserBio.FirstName }}'s bullet points for each of his experiences. The content has to 
	demonstrate that {{ .UserBio.FirstName }} meets most of the following job requirements and nice-to-haves: 
	- requirements: "{{ .JobPosting.Requirements }}"
	- nice-to-haves: "{{ .JobPosting.AddOn }}"
	Now, to achieve the abovementioned objective, follow exactly the following: 
	1. Before doing any improvements, state the match factor, an integer from 0-10 of the requirements to {{ .UserBio.FirstName }}'s original or given experience, 
	stating which bullet points do not meet the requirements and the reasons why. 
	2. Here is the list of {{ .UserBio.FirstName }}'s experience: "{{ .Experience.Achievements }}"
	containing the bullet points you need to improve. Return the improved bullet points. Please do the 
	following when you write your bullet points: 
	1. Note that the bullet points should contain not only things being done but also the impact to the business. 
	2. Please don't exceed 5 bullet points. 
	3. Do not just duplicate words from {{ .JobPosting.Company }}'s job requirements, you'll end up making up things that are not true! 
	Here are some examples of bullet points that you can produce for a random software engineer:
	"- Automated treasury reconciliation system by transforming SWIFT messages into a concise report in an internal portal, saving 70%% time
	- Developed alerting system for high-value foreign exchange (FX) transaction to better manage Starling's FX risk
	- Optimised PostgreSQL database transactions to more correctly calculate ledger balances, leading to 50%% cut in data processing time
	- Led collaboration with external partners to build better reporting capability inside Starling, saved months of potential backlog"\n 
	3. Return steps 1 and 2 into the following JSON format:
	{
		match: {
			matchFactor: number,
			reason: string
		},
		achievements: string,
	}
	Where "match" is the overall match of {{ .UserBio.FirstName }}'s achievements to the job requireemnts as stated in step 1, 
	and "achievements" is the improved version of {{ .UserBio.FirstName }}'s achievements as stated in step 2.
`
// TODO: Comment
var GenerateCVPrompt = `Generate a CV in a markdown format using the following PROFILE: "%s", following these exact and crucial steps, treating them as each of their own CV section,
  
(1)
"userBio" is the profile you'll put in as the header section. Only this section should be visually centered using div tags. DO NOT leave out the opening and the closing of the div tags for this section. Make sure to include the name, email, phone and address inside the div tags. 

(2)
As a start, open this section with "---" as a line separator in the markdown format. Put the heading as "Professional Summary" above the line separator.
  "summary" will be the second section. 

	Finally, close this section with "---" as a line separator in the markdown format

(3)
open this section with "---" as a line separator in the markdown format. Put the heading as "Experiences" above the line separator.
  "achievements" will be the main body of the CV as the third section. Make sure to list the start and end date of each achievements. However, ONLY list the dates alongside the job role and its company, instead of listing it in each bullet point.
  Write the dates in the format of: "From (Starting Date) to (end Date)", in a subscript format, alongside the job role and company line. See this example: 
  (- **Software Engineer** at Starling Bank _(June 2023 - Present)_)
  Only write the role and the company in the format of: (Job Role) at (Company)

	Finally, close this section with "---" as a line separator in the markdown format
  
(4)
Generate the "education" as the penultimate section of the CV. Put the heading as "Education" above the line separator.
Write the dates of the education in the format of: "From (Starting Date) to (end Date)", in a subscript format, alongside the degree role and institution line. See this example: 
  (- **MEng** at Harvard University _(June 2023 - Present)_)
  Only write the degree and the institution in the format of: (Degree) at (Institution)

(5) IF "skillsets" in the PROFILE is empty: Omit this section, as if it doesn't exist in the CV. in other words, DO NOT include any mention of skillsets, or include any "Skillsets" label or string in the markdown format or anywhere in the CV.  DO NOT put any skillsets heading and any Skillsets section in any way. DO NOT put any disclaimer as a result of this omission
ELSE:
Generate "skillsets" as the last section of the CV. Put the heading as "Skillsets"
As the last section, do not insert "---" as a line separator in the markdown format

In the case where "skillsets" is not in the CV, DO NOT insert "---" as the line separator after the "education" section.

 DO NOT put any note or any disclaimer in the markdown or the result of this prompt.`

 var SampleCvSystemPrompt = `You are a professional CV writer, CV coach and HR coach.`

 var SampleCvPrompt = `
**Prompt**

Imagine you are a professional resume writer tasked with creating a compelling CV example for {{ .Title }} with {{ .YearsOfExperience }} years of experience in the 
{{ .Sector }} sector. The CV should showcase three job experiences, each with 3-4 bullet points highlighting professional achievements relevant to the respective job roles. The biography, education, and skillset sections should be excluded.
Given this context, please generate a stunning CV example that impressively represents the {{ .Title }}'s skills and accomplishments. Remember to focus on the three job experiences, emphasizing the professional achievements within each role. Aim to make the CV engaging and persuasive, highlighting the {{ .Title }}'s relevant expertise to catch the attention of potential employers.

**What you will see:**
Professional Resume Writer Task: Create a CV example for a {{ .Title }} with {{ .YearsOfExperience }} years of experience in the {{ .Sector }}
sector. Exclude biography, education, and skillset sections.

**What you need to do:**

Generate an impressive CV example that showcases three job experiences, each with 3-4 bullet points highlighting professional achievements relevant to the respective job roles. Ensure the CV is engaging and persuasive, focusing on the expertise to catch the attention of potential employers. 

The output has to follow this JSON format for each of the job experience:

{
	"title": string, 
   
   "company": string,
   
   "sector": string,
   
	"isCurrent": boolean,
   
   "startDate": string,
   
   "endDate": string | null,
   
	"achievements": string,
   }

The content has to demonstrate meeting most of the following job requirements: (begin list) " 

{{ .JobRequirements }}

" (end of list).

**This is the sample output of the CV example of a project manager:**

Project Manager, ABC Company (November 2019 - Present)

- Successfully led a cross-functional team of 10 members to deliver a complex software project, resulting in a 20%% increase in efficiency.

- Implemented Agile methodologies, resulting in a 30%% decrease in project timeline and improved collaboration among team members.

- Managed project budget of $1 million, consistently delivering within 5%% deviation.

Assistant Project Manager, XYZ Corporation (April 2017 - November 2019)

- Assisted in the execution of a large-scale construction project, achieving project completion ahead of schedule and under budget.

- Led the implementation of a new project management software, resulting in a 25%% increase in team productivity.

- Streamlined communication channels between stakeholders, mitigating potential conflicts and ensuring smooth project progression.

Project Coordinator, DEF Solutions (November 2016 - April 2017)

- Coordinated project activities, ensuring timely execution and adherence to quality standards.

- Developed and implemented a risk management strategy, reducing project risks by 15%%.

- Assisted in the development of project plans and timelines, contributing to the successful completion of multiple projects.


Remember, do NOT include the test case scenarios and expected outputs in your prompt.

Only respond as a JSON array of this object:
{
	"id": string (index starts with 1),

	"title": string, 
   
   "company": string,
   
   "sector": string,
   
	"isCurrent": boolean,
   
   "startDate": string ("2023-08-19T13:15:48Z" for example),
   
   "endDate": string ("2023-08-19T13:15:48Z" for example)| null,
   
	"achievements": string (with \n newline please),
   }
`