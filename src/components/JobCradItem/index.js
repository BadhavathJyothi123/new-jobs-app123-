import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const JobCradItem = props => {
  const {item} = props

  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = item

  return (
    <>
      <Link to={`/jobs/${id}`} className="link">
        <li className="job-item-container">
          <div className="first-part-container">
            <div className="img-title-container">
              <img className="image" src={companyLogoUrl} alt="company logo" />
              <div className="title-rating-container">
                <h1 className="heading">{title}</h1>
                <div className="star-rating-container">
                  <AiFillStar className="star-icon" />
                  <p className="rating-text">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-container">
              <div className="location-job-container">
                <div className="location-icon-container">
                  <MdLocationOn className="icon" />
                  <p className="location">{location}</p>
                </div>
                <div className="employeement-location-container">
                  <p className="job-type">{employmentType}</p>
                </div>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="second-part-container">
            <h1 className="description-heading">Description</h1>
            <p className="des-para">{jobDescription}</p>
          </div>
        </li>
      </Link>
    </>
  )
}

export default JobCradItem
