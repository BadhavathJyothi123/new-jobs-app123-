import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusContants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJob extends Component {
  state = {
    jodDataDetails: [],
    similarJobData: [],
    apiStatus: apiStatusContants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusContants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(jobDetailsApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobData = [data.job_details].map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        companyWebsiteUrl: eachItem.company_website_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        skills: eachItem.skills.map(eachSkills => ({
          imageUrl: eachSkills.image_url,
          name: eachSkills.name,
        })),
        title: eachItem.title,
      }))

      const updatedSimilarJobDetails = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        employmentType: eachItem.employment_type,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jodDataDetails: updatedJobData,
        similarJobData: updatedSimilarJobDetails,
        apiStatus: apiStatusContants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusContants.failure})
    }
  }

  renderJobDetailsSuccessView = () => {
    const {jodDataDetails, similarJobData} = this.state
    if (jodDataDetails.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        // eslint-disable-next-line no-unused-vars
        jobDescription,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = jodDataDetails[0]

      return (
        <>
          <div className="job-item-container">
            <div className="first-part-container">
              <div className="img-title-container">
                <img
                  className="logo"
                  src={companyLogoUrl}
                  alt="job details company logo"
                />
                <div className="title-rating-container">
                  <h1 className="title">{title}</h1>
                  <div className="star-rating-container">
                    <AiFillStar className="star-icon" />
                    <p className="rating">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-container">
                <div className="location-job-type-container">
                  <div className="location-icon-container">
                    <MdLocationOn className="loaction-icon" />
                    <p className="loaction">{location}</p>
                  </div>
                  <div className="employee-type-icon-container">
                    <p className="job-type">{employmentType}</p>
                  </div>
                </div>
                <div className="package-container">
                  <p className="package">{packagePerAnnum}</p>
                </div>
              </div>
            </div>
            <hr className="line" />
            <div className="second-part-container">
              <div className="description-visit-container">
                <h1 className="description-heading">Description</h1>
                <a className="visit-anchor" href={companyWebsiteUrl}>
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p className="description-para">{jobDescription}</p>
            </div>
            <h1>Skills</h1>
            <ul className="ul-list">
              {skills.map(eachSkill => (
                <li className="list-skill" key={eachSkill.name}>
                  <img
                    className="skill-img"
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                  />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <div className="compnay-life-img-container">
              <div className="life-heading-para-container">
                <h1 className="life-heading">Life at Company</h1>
                <p>{lifeAtCompany.description}</p>
              </div>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>
          <h1 className="similar-jobs">Similar Jobs</h1>
          <ul className="similar-list">
            {similarJobData.map(eachItem => (
              <SimilarJobs
                key={eachItem.id}
                similarJobDetails={eachItem}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  onRetryJobDetailsAgain = () => {
    this.getJobData()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <div className="btn-container">
        <button
          className="retry-btn"
          type="button"
          onClick={this.onRetryJobDetailsAgain}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusContants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusContants.failure:
        return this.renderFailureView()
      case apiStatusContants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-container">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default AboutJob
