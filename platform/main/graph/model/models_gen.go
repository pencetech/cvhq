// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"
)

type AchievementInput struct {
	UserBio    *UserBioInput    `json:"userBio"`
	JobPosting *JobPostingInput `json:"jobPosting"`
	Experience *ExperienceInput `json:"experience"`
}

type CVContent struct {
	UserBio     *UserBio      `json:"userBio"`
	Summary     *Summary      `json:"summary"`
	Experiences []*Experience `json:"experiences"`
	Education   []*Education  `json:"education"`
	Skillsets   *Skillset     `json:"skillsets,omitempty"`
}

type CVContentInput struct {
	UserBio     *UserBioInput      `json:"userBio"`
	Summary     *SummaryInput      `json:"summary"`
	Experiences []*ExperienceInput `json:"experiences"`
	Education   []*EducationInput  `json:"education"`
	Skillsets   *SkillsetInput     `json:"skillsets,omitempty"`
}

type Cv struct {
	ID         *string     `json:"id,omitempty"`
	CvContent  *CVContent  `json:"cvContent"`
	JobPosting *JobPosting `json:"jobPosting"`
	CvType     *CvType     `json:"cvType,omitempty"`
}

type CvFile struct {
	Filename  string `json:"filename"`
	CreatedAt string `json:"createdAt"`
}

type CvInput struct {
	ID         *string          `json:"id,omitempty"`
	CvContent  *CVContentInput  `json:"cvContent"`
	JobPosting *JobPostingInput `json:"jobPosting"`
	CvType     *CvType          `json:"cvType,omitempty"`
}

type Education struct {
	ID          *string `json:"id,omitempty"`
	Subject     string  `json:"subject"`
	Institution string  `json:"institution"`
	Degree      string  `json:"degree"`
	StartDate   string  `json:"startDate"`
	EndDate     string  `json:"endDate"`
}

type EducationInput struct {
	ID          *string `json:"id,omitempty"`
	Subject     string  `json:"subject"`
	Institution string  `json:"institution"`
	Degree      string  `json:"degree"`
	StartDate   string  `json:"startDate"`
	EndDate     string  `json:"endDate"`
}

type EnhancedAchievement struct {
	Match        *Match `json:"match"`
	Achievements string `json:"achievements"`
}

type Experience struct {
	ID           *string `json:"id,omitempty"`
	Title        string  `json:"title"`
	Company      string  `json:"company"`
	Sector       string  `json:"sector"`
	IsCurrent    bool    `json:"isCurrent"`
	StartDate    string  `json:"startDate"`
	EndDate      *string `json:"endDate,omitempty"`
	Achievements string  `json:"achievements"`
}

type ExperienceInput struct {
	ID           *string `json:"id,omitempty"`
	Title        string  `json:"title"`
	Company      string  `json:"company"`
	Sector       string  `json:"sector"`
	IsCurrent    bool    `json:"isCurrent"`
	StartDate    string  `json:"startDate"`
	EndDate      *string `json:"endDate,omitempty"`
	Achievements string  `json:"achievements"`
}

type JobPosting struct {
	Title        string  `json:"title"`
	Company      string  `json:"company"`
	Sector       string  `json:"sector"`
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

type Skillset struct {
	Skillsets string `json:"skillsets"`
}

type SkillsetInput struct {
	Skillsets string `json:"skillsets"`
}

type Summary struct {
	Summary string `json:"summary"`
}

type SummaryInput struct {
	Summary string `json:"summary"`
}

type UserBio struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
}

type UserBioInput struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
}

type CvType string

const (
	CvTypeBase  CvType = "BASE"
	CvTypePrime CvType = "PRIME"
)

var AllCvType = []CvType{
	CvTypeBase,
	CvTypePrime,
}

func (e CvType) IsValid() bool {
	switch e {
	case CvTypeBase, CvTypePrime:
		return true
	}
	return false
}

func (e CvType) String() string {
	return string(e)
}

func (e *CvType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = CvType(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid CvType", str)
	}
	return nil
}

func (e CvType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
