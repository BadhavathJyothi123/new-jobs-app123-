import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
import Cookies from 'js-cookie'
import JobCradItem from '../JobCradItem'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusContants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobStatusContants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    apiStatus: apiStatusContants.initial,
    apiJobStatus: apiJobStatusContants.initial,
    profileData: {},
    jobsData: [],
    activeCheckBoxList: [],
    activeSalaryRangeId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusContants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, option)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const profile = data.profile_details
      const updatedProfileDetails = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      console.log(updatedProfileDetails)
      this.setState({
        profileData: updatedProfileDetails,
        apiStatus: apiStatusContants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusContants.failure,
      })
    }
  }

  getJobsData = async () => {
    this.setState({apiJobStatus: apiJobStatusContants.inProgress})
    const {activeCheckBoxList, activeSalaryRangeId, searchInput} = this.state
    const type = activeCheckBoxList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, option)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const filteredJobsList = data.jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      console.log(filteredJobsList)

      this.setState({
        jobsData: filteredJobsList,
        apiJobStatus: apiJobStatusContants.success,
      })
    } else {
      this.setState({apiJobStatus: apiJobStatusContants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  onEneterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onSelectSalaryRange = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getJobsData)
  }

  onClickCheckBox = event => {
    const {activeCheckBoxList} = this.state
    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedList = activeCheckBoxList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeCheckBoxList: updatedList}, this.getJobsData)
    } else {
      this.setState(
        pervState => ({
          activeCheckBoxList: [
            ...pervState.activeCheckBoxList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  onSuccessProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-conatiner">
        <img className="image" src={profileImageUrl} alt="profile" />
        <h1 className="name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  onSuccessJobView = () => {
    const {jobsData} = this.state
    const noOfJobs = jobsData.length > 0

    return noOfJobs ? (
      <>
        <ul className="ul-job-list">
          {jobsData.map(each => (
            <JobCradItem key={each.id} item={each} />
          ))}
        </ul>
      </>
    ) : (
      <div className="no-jobs-container">
        <img
          className="no-jobs-image"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )
  }

  onRetryProfile = () => this.getProfileData()

  onRetryJobs = () => this.getJobsData()

  onFailureProfileView = () => (
    <>
      <h1>Profile Fail</h1>
      <button type="button" onClick={this.onRetryProfile}>
        Retry
      </button>
    </>
  )

  onFailureJobViwe = () => (
    <>
      <div className="failure-job-container">
        <img
          className="failure-image"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-para">
          we cannot seem to find the page you are looking for
        </p>
        <div className="jobs-failure-button">
          <button
            data-testid="button"
            className="failure-btn"
            type="button"
            onClick={this.onRetryJobs}
          >
            Retry
          </button>
        </div>
      </div>
    </>
  )

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onGetCheckBoxView = () => (
    <ul className="checkbox-list">
      {employmentTypesList.map(eachItem => (
        <li className="li-container" key={eachItem.employmentTypeId}>
          <input
            className="input"
            id={eachItem.employmentTypeId}
            type="checkbox"
            onChange={this.onClickCheckBox}
          />
          <label className="label" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonView = () => (
    <ul className="radio-btn-container">
      {salaryRangesList.map(each => (
        <li className="li-container" key={each.salaryRangeId}>
          <input
            className="input"
            id={each.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onSelectSalaryRange}
          />
          <label className="label" htmlFor={each.salaryRangeId}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onRenderProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContants.inProgress:
        return this.onLoading()
      case apiStatusContants.failure:
        return this.onFailureProfileView()
      case apiStatusContants.success:
        return this.onSuccessProfileView()
      default:
        return null
    }
  }

  onRenderJobs = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiJobStatusContants.inProgress:
        return this.onLoading()
      case apiJobStatusContants.failure:
        return this.onFailureJobViwe()
      case apiJobStatusContants.success:
        return this.onSuccessJobView()
      default:
        return null
    }
  }

  onRenderSearch = () => {
    const {searchInput} = this.state
    return (
      <>
        <input
          className="search-input"
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEneterSearchInput}
        />
        {/* eslint-disable-next-line */}
        <button
          data-testid="searchButton"
          type="button"
          className="search-input"
          onClick={this.onSubmitSearchInput}
        >
          <AiOutlineSearch className="search-icon" />
        </button>
      </>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="body-container">
          <div className="sm-search-container">{this.onRenderSearch()}</div>
          <div className="side-bar-conatiner">
            {this.onRenderProfile()}
            <hr className="line" />
            <h1 className="text">Type of Employment</h1>
            {this.onGetCheckBoxView()}
            <hr className="line" />
            <h1 className="text">Salary Range</h1>
            {this.onGetRadioButtonView()}
          </div>
          <div className="jobs-container">
            <div className="lg-search-container">{this.onRenderSearch()}</div>
            {this.onRenderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
