import { Card, SummaryList } from "nhsuk-react-components";

type CojGg10Props = {
  progName: string;
};

const CojGg10: React.FC<CojGg10Props> = ({ progName }) => {
  return (
    <Card feature>
      <Card.Content>
        <Card.Heading data-cy="cojHeading">
          Conditions of Joining Agreement
        </Card.Heading>
        <h3 className="card-heading-spaced-top">{`${progName} Specialty Training Programme `}</h3>
        <SummaryList noBorder>
          <SummaryList.Row>
            <SummaryList.Value>
              <b>Please note: This is not an offer of employment.</b>
            </SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Value>Dear Postgraduate Dean,</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Value>
              On accepting an offer to join a training programme in{" "}
              <b>{progName}</b>, I agree to meet the following requirements
              throughout the duration of the programme:
            </SummaryList.Value>
          </SummaryList.Row>
          <ul>
            <li>
              I will always have at the forefront of my clinical and
              professional practice the principles of Good Medical Practice for
              the benefit of safe patient care. I am aware that Good Medical
              Practice requires me to keep my knowledge and skills up to date
              throughout my working life, and to regularly take part in
              educational activities that maintain and further develop my
              capabilities, competence and performance.
            </li>
            <li>
              As a postgraduate doctor in training, I will make myself familiar
              with my curriculum and meet the requirements set within it. I will
              use the available training resources optimally to develop my
              knowledge, skills and attitudes to the standards set by the
              relevant curriculum. This will include additional requirements as
              set out by the relevant curriculum.
            </li>
            <li>
              I will ensure that the care I give to patients is responsive to
              their needs, and that it is equitable, respects human rights,
              challenges discrimination, promotes equality, and maintains the
              dignity of patients and carers.
            </li>
            <li>
              I will ensure that I treat my clinical and non-clinical colleagues
              with respect, promoting a culture of teamworking across all
              professions working in healthcare.
            </li>
            <li>
              I will maintain my General Medical Council (GMC) registration with
              a licence to practise (even if temporarily out of programme). For
              all postgraduate doctors in training, failure to do so may result
              in a police investigation, immediate suspension from employment
              and referral to the GMC. Failure to do so may also result in my
              removal from the training programme.
            </li>
            <li>
              I understand my responsibilities within revalidation, that I must
              declare my full scope of practice (including locum positions) and
              that I will provide evidence for all areas of activity using Form
              R (Part B) to inform the Annual Review of Competence Progression
              panel and Responsible Officer (RO) of my full scope of practice. I
              understand that my RO is the Postgraduate Dean (or the Medical
              Director in Health Education and Improvement Wales (HEIW), and the
              Northern Ireland Medical and Dental Training Agency (NIMDTA)), and
              that NHS England Workforce, Training and Education (NHSE WTE), NHS
              Education for Scotland (NES), HEIW or NIMDTA is my designated
              body.
            </li>
            <li>
              I agree that I will only assume responsibility for or perform
              procedures in areas where I have sufficient knowledge, experience
              and expertise as set out by the GMC, my employers and my clinical
              supervisors.
            </li>
            <li>
              I will have adequate insurance and indemnity cover, in accordance
              with GMC guidance. I understand that personal indemnity cover is
              also strongly recommended.
            </li>
            <li>
              I will inform my RO, NHSE WTE/NES/HEIW/NIMDTA and my employer
              immediately if I am currently under investigation by the police,
              the GMC/General Dental Council (GDC), NHS Resolution or other
              regulatory body, and I will inform my RO and NHSE
              WTE/NES/HEIW/NIMDTA if I am under investigation by my employer. I
              also agree to share information on the progress of any
              investigations.
            </li>
            <li>
              I will inform my RO, NHSE WTE/NES/HEIW/NIMDTA and my employer
              immediately if the Medical Practitioners Tribunal Service or
              GMC/GDC place any conditions (interim or otherwise) on my licence,
              or if I am suspended or erased/removed from the medical or dental
              register/Performers List, or if NHSE WTE/NES/HEIW/NIMDTA takes
              action to restrict my ability to work as a doctor or a dentist.
            </li>
            <li>
              I will provide my employer and NHSE WTE/NES/HEIW/NIMDTA with
              adequate notice as per GMC guidance/contract requirements if I
              wish to resign from my post/training programme.
            </li>
            <li>
              I will maintain a prescribed connection with NHSE
              WTE/NES/HEIW/NIMDTA, work in an approved practice setting until my
              GMC revalidation date (this applies to all doctors granted full
              registration after 2 June 2014) and comply with all requirements
              regarding the GMC revalidation process.
            </li>
            <li>
              I will ensure that I comply with the standards required from
              doctors when engaging with social media, and I will adhere to my
              employer’s policy on social media and GMC guidance.
            </li>
            <li>
              I acknowledge that as an employee in a healthcare organisation, I
              accept the responsibility to abide by Good Medical Practice and
              work effectively as an employee for that organisation; this
              includes familiarity with policies (including absence policies) as
              well as participating in pre-employment checks and occupational
              health assessments, employer/departmental inductions, and
              workplace-based appraisal and educational appraisal. I acknowledge
              and agree to the need to share information about my performance as
              a postgraduate doctor in training with other organisations (e.g.
              employers, medical schools, the GMC and Colleges/training bodies
              involved in my training) and with the Postgraduate Dean on a
              regular basis.
            </li>
            <li>
              I acknowledge that data will be collected to support the following
              processes, and I will comply with the requirements of the General
              Data Protection Regulation, the Data Protection Act 2018 and such
              other data protection as is in force from time to time:
              <ol type="a">
                <li>
                  Managing the provision of training programmes including
                  inter-deanery transfers
                </li>
                <li>
                  Managing processes allied to training programmes, such as
                  certification, evidence to support revalidation and supporting
                  the requirements of regulators
                </li>
                <li>Quality assurance of training programmes</li>
                <li>Workforce planning</li>
                <li>Ensuring and improving patient safety</li>
                <li>
                  Compliance with legal and regulatory responsibilities,
                  including monitoring under the Equality Act 2010
                </li>
                <li>Research related to any of the above</li>
              </ol>
            </li>
            <li>
              I will maintain regular contact with my Training Programme
              Director, other trainers and NHSE WTE/NES/HEIW/NIMDTA by
              responding promptly to communications from them.
            </li>
            <li>
              I will participate proactively in the appraisal, assessment and
              programme planning process, including providing required
              documentation to the prescribed timescales and progressing my
              training without unreasonable delay.
            </li>
            <li>
              I will ensure that I develop and keep up to date my learning
              e-portfolio, which underpins the training process and documents my
              progress through the programme.
            </li>
            <li>
              I agree to ensure timely registration with the appropriate
              College/Faculty.
            </li>
            <li>
              I will support the development and evaluation of my training
              programme by participating actively in the GMC’s annual national
              training survey/programme-specific surveys as well as in any other
              activities that contribute to the quality improvement of training.
            </li>
            <li>
              I acknowledge that where programmes are time dependant, failure to
              complete the required time in programme may result in a
              developmental outcome.
            </li>
          </ul>
        </SummaryList>
      </Card.Content>
    </Card>
  );
};

export default CojGg10;
