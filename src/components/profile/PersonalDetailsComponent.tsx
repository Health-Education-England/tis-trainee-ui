import React from "react";
import { PersonalDetails } from "../../models/PersonalDetails";
import { ProfileService } from "../../services/ProfileService";

interface AppProps {}

interface AppState {
  isLoaded: boolean;
  data: PersonalDetails | null;
  error: any;
}

class PersonalDetailsComponent extends React.PureComponent<AppProps, AppState> {
  profileService: ProfileService;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      isLoaded: false,
      data: null,
      error: null
    };

    this.profileService = new ProfileService();
  }

  componentDidMount() {
    this.profileService
      .getPersonalDetails()
      .then(result => {
        this.setState({
          isLoaded: true,
          data: result.data,
          error: null
        });
      })
      .catch(error => {
        this.setState({
          isLoaded: false,
          data: null,
          error: error
        });
      });
  }

  render() {
    const { isLoaded, data, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        data && (
          <div className="profile-content">
            <h2>Contact details</h2>
            <h6>
              {data.title}. {data.forenames} {data.surname}
            </h6>
            {data.maidenName && <div> Maiden Name: <h4>{data.maidenName}</h4></div> }
            {data.knownAs && <div> Known As: <h4>{data.knownAs}</h4></div> }
            Email: <h4>{data.email}</h4>
            Telephone: <h4>{data.telephoneNumber}</h4>
            {data.mobileNumber && <div> Mobile: <h4>{data.mobileNumber}</h4></div> }
            Address: <h4>{data.address1}</h4>
            <h5>
              {data.address2} {data.address3} {data.address4}
            </h5>
            Postcode: <h4>{data.postCode}</h4>
            {data.gmcNumber && <div>GMC Number: <h4>{data.gmcNumber}</h4></div> }
            {data.gmcStatus && <div>GMC Status: <h4>{data.gmcStatus}</h4></div> }
            {data.gdcNumber && <div>GDC Number: <h4>{data.gdcNumber}</h4></div> }
            {data.gdcStatus && <div>GDC Status: <h4>{data.gdcStatus}</h4></div> }
            {data.publicHealthNumber && <div>Public Health Number: <h4>{data.publicHealthNumber}</h4></div> }
            {data.permitToWork && <div>Permit to Work: <h4>{data.permitToWork}</h4></div> }
            {data.settled && <div>Settled: <h4>{data.settled}</h4></div> }
            {data.visaIssued && <div>Visa Issued: <h4>{data.visaIssued}</h4></div> }
            {data.detailsNumber && <div>Details/Number: <h4>{data.detailsNumber}</h4></div> }
          </div>
        )
      );
    }
  }
}

export default PersonalDetailsComponent;
