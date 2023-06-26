// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type AchievementInput struct {
	UserBio    *UserBioInput    `json:"userBio"`
	JobPosting *JobPostingInput `json:"jobPosting"`
	Experience *ExperienceInput `json:"experience"`
}

type Cv struct {
	Type    string `json:"type"`
	Content string `json:"content"`
}

type Education struct {
	ID          string `json:"id"`
	Subject     string `json:"subject"`
	Institution string `json:"institution"`
	Degree      string `json:"degree"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
}

type EducationInput struct {
	ID          string `json:"id"`
	Subject     string `json:"subject"`
	Institution string `json:"institution"`
	Degree      string `json:"degree"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
}

type EnhancedAchievement struct {
	Match        *Match `json:"match"`
	Achievements string `json:"achievements"`
}

type Experience struct {
	ID           string  `json:"id"`
	Title        string  `json:"title"`
	IsCurrent    bool    `json:"isCurrent"`
	StartDate    string  `json:"startDate"`
	EndDate      *string `json:"endDate,omitempty"`
	Achievements string  `json:"achievements"`
}

type ExperienceInput struct {
	ID           string  `json:"id"`
	Title        string  `json:"title"`
	Company      string  `json:"company"`
	IsCurrent    bool    `json:"isCurrent"`
	StartDate    string  `json:"startDate"`
	EndDate      *string `json:"endDate,omitempty"`
	Achievements string  `json:"achievements"`
}

type JobPosting struct {
	Title        string  `json:"title"`
	Company      string  `json:"company"`
	Requirements string  `json:"requirements"`
	AddOn        *string `json:"addOn,omitempty"`
}

type JobPostingInput struct {
	Title        string  `json:"title"`
	Company      string  `json:"company"`
	Sector       string  `json:"sector"`
	Requirements string  `json:"requirements"`
	AddOn        *string `json:"addOn,omitempty"`
}

type Match struct {
	MatchFactor *int   `json:"matchFactor,omitempty"`
	Reason      string `json:"reason"`
}

type Profile struct {
	ID          string        `json:"id"`
	UserBio     *UserBio      `json:"userBio"`
	Experiences []*Experience `json:"experiences"`
	Education   []*Education  `json:"education"`
	Skillsets   *Skillset     `json:"skillsets,omitempty"`
}

type ProfileInput struct {
	ID          string             `json:"id"`
	UserBio     *UserBioInput      `json:"userBio"`
	Experiences []*ExperienceInput `json:"experiences"`
	Education   []*EducationInput  `json:"education"`
	Skillsets   *SkillsetInput     `json:"skillsets,omitempty"`
}

type Skillset struct {
	Skillsets string `json:"skillsets"`
}

type SkillsetInput struct {
	Skillsets string `json:"skillsets"`
}

type UserBio struct {
	FirstName string   `json:"firstName"`
	LastName  string   `json:"lastName"`
	Email     string   `json:"email"`
	Phone     []string `json:"phone"`
	Address   string   `json:"address"`
}

type UserBioInput struct {
	FirstName string   `json:"firstName"`
	LastName  string   `json:"lastName"`
	Email     string   `json:"email"`
	Phone     []string `json:"phone"`
	Address   string   `json:"address"`
}
