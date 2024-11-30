import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    jobDescription,
    employmentType,
    location,
    rating,
    title,
  } = similarJobDetails

  console.log(similarJobDetails)

  return (
    <li className="similar-job-li-conatiner">
      <div className="img-job-title-container">
        <img
          className="logo"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="title-job-rating-container">
          <h1 className="title">{title}</h1>
          <div className="star-job-rating-container">
            <AiFillStar className="star-icon" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>
      <div className="second-part-job-container">
        <h1 className="description-heading">Description</h1>
        <p className="job-para">{jobDescription}</p>
      </div>
      <div className="location-job-conatiner">
        <div className="location-icon-container">
          <MdLocationOn className="location-icon" />
          <p className="location">{location}</p>
        </div>
        <div className="employment-container">
          <p className="job-type">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
