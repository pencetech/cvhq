package graph

import (
	"reflect"
	"text/template"
)

var CvSummaryPrompt1 = `You are a professional CV and resume coach.
  
Write a biographical resume summary section between 350 and 400 characters with the following profile: "%s",


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
var CvSummaryPrompt2 = `print the following object as text: "%s",


Also print this object as text: "%s",

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

Rule 3: "achievements" bullet points must contain the impact to the business and can be quantified in a numerical sense. An example of this is (begin list) " - Automated treasury  system saving 70% time year per year. - Optimised transactions , leading to 50% cut in data processing time. - Contributed to territory expansion leading to new 100 clients per quarter. - Drove 120% increased revenue in Finance sector clients." (end of list).

Rule 4: "achievements" doesnt exceed 5 bullet points.

Rule 5: "achievements" must not just duplicate words from the listed job requirements, you'll end up making up things that are not true! 

Rule 6: "achievements" at least 2/3 of the bullet points must contain the impact to the business and can be quantified in a numerical sense. Always include a numeric,percentage, or KPI-specific information. An example of this is (begin list) " - Automated treasury  system saving 70% time year per year. - Optimised transactions , leading to 50% cut in data processing time. - Contributed to territory expansion leading to new 100 clients per quarter. - Drove 120% increased revenue in Finance sector clients." (end of list).
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

var SansCV = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
	<title>{{ .UserBio.FirstName }} {{ .UserBio.LastName }} | {{ .UserBio.Email }}</title>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />

	<meta name="keywords" content="" />
	<meta name="description" content="" />

	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" />
	<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.7.0/build/reset-fonts-grids/reset-fonts-grids.css" media="all" /> 
	<style type="text/css">
		.msg {
		  padding: 10px;
		  background: #222;
		  position: relative;
		}
		.msg h1 {
		  color: #fff;
		}
		.msg a {
		  margin-left: 20px;
		  background: #408814;
		  color: white;
		  padding: 4px 8px;
		  text-decoration: none;
		}
		.msg a:hover {
		  background: #266400;
		}
		
		/* //-- yui-grids style overrides -- */
		body {
		  font-family: "Plus Jakarta Sans", sans-serif;
		}
		
		#inner {
		  padding: 10px 60px;
		  margin: 80px auto;
		}
		.yui-gf {
		  margin-bottom: 2em;
		  padding-bottom: 2em;
		  border-bottom: 1px solid #ccc;
		}
		
		/* //-- header, body, footer -- */
		#hd {
		  margin: 2.5em 0 2em 0;
		  padding-bottom: 1.5em;
		  border-bottom: 1px solid #ccc;
		}
		#hd h2 {
		  text-transform: uppercase;
		  letter-spacing: 2px;
		}
		#bd,
		#ft {
		  margin-bottom: 2em;
		}
		
		/* //-- footer -- */
		#ft {
		  padding: 1em 0 3em 0;
		  font-size: 92%;
		  border-top: 1px solid #ccc;
		  text-align: center;
		}
		#ft p {
		  margin-bottom: 0;
		  text-align: center;
		}
		
		/* //-- core typography and style -- */
		#hd h1 {
		  font-size: 36px;
		  text-transform: uppercase;
		  font-weight: bold;
		  letter-spacing: 2px;
		}
		h2 {
		  font-size: 152%;
		}
		h3,
		h4 {
		  font-size: 122%;
		}
		h1,
		h2,
		h3,
		h4 {
		  color: #333;
		}
		p {
		  font-size: 100%;
		  line-height: 18px;
		  padding-right: 3em;
		}
		a {
		  color: #990003;
		}
		a:hover {
		  text-decoration: none;
		}
		strong {
		  font-weight: bold;
		}
		li {
		  line-height: 24px;
		  border-bottom: 1px solid #ccc;
		}
		
		p.enlarge {
		  font-size: 120%;
		  padding-right: 6.5em;
		  line-height: 22px;
		}
		p.enlarge span {
		  color: #000;
		}
		
		.first h2 {
		  font-weight: bold;
		}
		.last {
		  border-bottom: 0;
		}
		
		/* //-- section styles -- */
		
		.job {
		  position: relative;
		  margin-bottom: 1em;
		  padding-bottom: 1em;
		  border-bottom: 1px solid #ccc;
		}
		.job h4 {
		  position: absolute;
		  top: 0.35em;
		  right: 0;
		}
		.job p {
		  margin: 0.75em 0 2em 0;
		}
		
		.education {
			position: relative;
			margin-bottom: 1em;
			padding-bottom: 1em;
		  }
		
		.last {
		  border: none;
		}
		
		#srt-ttab {
		  margin-bottom: 100px;
		  text-align: center;
		}
		#srt-ttab img.last {
		  margin-top: 20px;
		}
		
		/* --// override to force 1/8th width grids -- */
		.yui-gf .yui-u {
		  width: 83.2%;
		}
		.yui-gf div.first {
		  width: 12.3%;
		}
		
			</style>
</head>
<body>

<div id="doc2" class="yui-t7">
	<div id="inner">
	
		<div id="hd">
			<div class="yui-gc">
				<div class="yui-u first">
					<h1 class="smaller">{{ .UserBio.FirstName }} {{ .UserBio.LastName }}</h1>
				</div>

				<div class="yui-u">
					<div class="contact-info">
						<h3><a href="mailto:{{ .UserBio.Email }}">{{ .UserBio.Email }}</a></h3>
						<h3>{{ .UserBio.Phone }}</h3>
						<h3>{{ .UserBio.Address }}</h3>
					</div><!--// .contact-info -->
				</div>
			</div><!--// .yui-gc -->
		</div><!--// hd -->

		<div id="bd">
			<div id="yui-main">
				<div class="yui-b">

					<div class="yui-gf">
						<div class="yui-u first">
							<h2>Summary</h2>
						</div>
						<div class="yui-u">
							<p class="enlarge">
								{{ .Summary }}
							</p>
						</div>
					</div><!--// .yui-gf -->
					<div class="yui-gf">
	
						<div class="yui-u first">
							<h2>Experience</h2>
						</div><!--// .yui-u -->

						<div class="yui-u">
							{{ range $i, $e := .Experiences }}
							{{ if $i }}
							<div class="job">
							{{ end }}
							{{ if last $i $e }}
							{{ end }}
							<div class="job last">
								<h2>{{ $e.Company }}</h2>
								<h3>{{ $e.Title }}</h3>
								<h4>{{ $e.StartDate }} - {{ if $e.IsCurrent }} Present{{ else }} {{ $e.EndDate }}{{ end }}</h4>
								<p>{{ $e.Achievements }}</p>
							</div>
							{{ end }}
						</div><!--// .yui-u -->
					</div><!--// .yui-gf -->


					<div class="yui-gf">
						<div class="yui-u first">
							<h2>Education</h2>
						</div>
						<div class="yui-u">
						{{ range .Education }}
							<div class="education">
								<h2>{{ .Institution }}</h2>
								<h3>{{ .Degree }}, {{ .Subject }}</h3>
							</div>
						{{ end }}
						</div>
					</div><!--// .yui-gf -->
					<div class="yui-gf last">
						<div class="yui-u first">
							<h2>Skillsets</h2>
						</div>
						<div class="yui-u">
							<h3>{{ .Skillsets.Skillsets }}</h3>
						</div>
					</div>

				</div><!--// .yui-b -->
			</div><!--// yui-main -->
		</div><!--// bd -->

		<div id="ft">
			<p>{{ .UserBio.FirstName }} {{ .UserBio.LastName }} &mdash; <a href="mailto:{{ .UserBio.Email }}">{{ .UserBio.Email }}</a> &mdash; {{ .UserBio.Phone }}</p>
			<p>Made with CVHQ</p>
		</div><!--// footer -->

	</div><!-- // inner -->


</div><!--// doc -->


</body>
</html>

`

var fns = template.FuncMap{
    "last": func(x int, a interface{}) bool {
        return x == reflect.ValueOf(a).Len() - 1
    },
}