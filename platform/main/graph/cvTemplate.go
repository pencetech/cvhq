package graph

import "text/template"

var baseSansCSS = `
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
	padding: 10px 80px;
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
  }
  
  /* //-- footer -- */
  #ft {
	padding: 1em 0 2em 0;
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
	font-size: 172%;
	padding-bottom: 4px;
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

  h3.address {
	white-space: pre-wrap;
  }
  
  p.enlarge {
	font-size: 140%;
	padding-right: 6.5em;
	line-height: 24px;
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
  
  .job {
	position: relative;
	margin-bottom: 1em;
	padding-bottom: 1.5em;
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
  p.achievements {
	  font-size: 120%;
	  line-height: 22px;
	white-space: pre-wrap;
  }
  
  .education {
	  position: relative;
	  margin-bottom: 1em;
	  padding-bottom: 1em;
	}
  
	.education h4 {
		position: absolute;
		top: 0.35em;
		right: 0;
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
  
  .yui-gf .yui-u {
	width: 82.5%;
  }
  .yui-gf div.first {
	width: 12.3%;
  }`

var primeSansCSS = `
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
  
  /* //-- footer -- */
  #ft {
	padding: 1em 0 1em 0;
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

  h3.address {
	white-space: pre-wrap;
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
  p.achievements {
	white-space: pre-wrap;
  }
  
  .education {
	  position: relative;
	  margin-bottom: 1em;
	  padding-bottom: 1em;
	}

	.education h4 {
		position: absolute;
		top: 0.35em;
		right: 0;
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
  
  .yui-gf .yui-u {
	width: 85%;
  }
  .yui-gf div.first {
	width: 12.3%;
  }`

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
		%s
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
						<h3 class="address">{{ .UserBio.Address }}</h3>
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
								{{ .Summary.Summary }}
							</p>
						</div>
					</div><!--// .yui-gf -->
					<div class="yui-gf">
	
						<div class="yui-u first">
							<h2>Experience</h2>
						</div><!--// .yui-u -->

						<div class="yui-u">
							{{ $n := len .Experiences }}
							{{ range $i, $e := .Experiences }}
							{{ if eq (plus1 $i) $n }}
							<div class="job last">
							{{ else }}
							<div class="job">
							{{ end }}
								<h2>{{ $e.Company }}</h2>
								<h3>{{ $e.Title }}</h3>
								<h4>{{ $e.StartDate }} - {{ if $e.IsCurrent }} Present{{ else }} {{ $e.EndDate }}{{ end }}</h4>
								<p class="achievements">{{ $e.Achievements }}</p>
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
								<h4>{{ .StartDate }} - {{ .EndDate }}</h4>
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

var SerifCV = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
	<title>{{ .UserBio.FirstName }} {{ .UserBio.LastName }} | {{ .UserBio.Email }}</title>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="keywords" content="" />
	<meta name="description" content="" />

	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
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
		  font-family: "Cormorant Garamond", serif;
		}
		
		#inner {
		  margin: 80px auto;
		}
		.yui-gc {
		  display: flex;
		  flex-direction: column;
		  justify-content: center;
		}
		.yui-gf {
		  display: flex;
		  flex-direction: column;
		  margin-bottom: 1em;
		  padding-bottom: 2em;
		  border-bottom: 1px solid #ccc;
		}
		
		/* //-- header, body, footer -- */
		#hd {
		  margin: 2.5em 0 1em 0;
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

		h3.address {
		  white-space: pre-wrap;
		}
		
		p.enlarge {
		  font-size: 120%;
		  line-height: 20px;
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
		
		.job {
		  position: relative;
		  margin-bottom: 1em;
		  padding-bottom: .5em;
		}
		.job h4 {
		  position: absolute;
		  top: 0.35em;
		  right: 0;
		}
		.job p {
		  margin: 0.75em 0 1em 0;
		}
		p.achievements {
		  white-space: pre-wrap;
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
		.yui-gc .yui-u {
		  align-self: center;
		  text-align: center;
		}
		.yui-gf .yui-u {
		  width: 100%;
		}
		.yui-gf div.first {
		  width: 12.3%;
		  padding-bottom: 1.5em;
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

				<div class="yui-u first">
					<div class="contact-info">
						<h3><a href="mailto:{{ .UserBio.Email }}">{{ .UserBio.Email }}</a> | {{ .UserBio.Phone }}</h3>
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
								{{ .Summary.Summary }}
							</p>
						</div>
					</div><!--// .yui-gf -->
					<div class="yui-gf">
	
						<div class="yui-u first">
							<h2>Experience</h2>
						</div><!--// .yui-u -->

						<div class="yui-u">
						{{ $n := len .Experiences }}
						{{ range $i, $e := .Experiences }}
						{{ if eq (plus1 $i) $n }}
						<div class="job last">
						{{ else }}
						<div class="job">
						{{ end }}
							<h2>{{ $e.Company }}</h2>
							<h3>{{ $e.Title }}</h3>
							<h4>{{ $e.StartDate }} - {{ if $e.IsCurrent }} Present{{ else }} {{ $e.EndDate }}{{ end }}</h4>
							<p class="achievements enlarge">{{ $e.Achievements }}</p>
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
			<p>{{ .UserBio.FirstName }} {{ .UserBio.LastName }} &mdash; <a href="{{ .UserBio.Email }}">{{ .UserBio.Email }}</a> &mdash; (313) - 867-5309</p>
			<p>Made with CVHQ</p>
		</div><!--// footer -->

	</div><!-- // inner -->


</div><!--// doc -->


</body>
</html>

`

var fns = template.FuncMap{
	"plus1": func(x int) int {
		return x + 1
	},
}