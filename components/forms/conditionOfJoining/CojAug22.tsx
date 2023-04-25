import { Card, SummaryList } from "nhsuk-react-components";

type CojAug22Props = {
  progName: string;
};

const CojAug22: React.FC<CojAug22Props> = ({ progName }) => {
  return (
    <>
      <Card feature>
        <Card.Content>
          <Card.Heading>Conditions of Joining Agreement</Card.Heading>
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
            <SummaryList.Row>
              <SummaryList.Value>
                • I will always have at the forefront of my clinical and
                professional practice the principles of Good Medical Practice
                for the benefit of safe patient care. I am aware that Good
                Medical Practice requires me to keep my knowledge and skill up
                to date throughout my working life, and to regularly take part
                in educational activities that maintain and further develop my
                capabilities, competence and performance.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • As a doctor in training, I will make myself familiar with my
                curriculum and meet the requirements set within it. I will use
                training resources available optimally to develop my knowledge,
                skills and attitudes to the standards set by the relevant
                curriculum. This will include additional requirements as set out
                by the relevant curriculum.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will ensure that the care I give to patients is responsive
                to their needs, and that it is equitable, respects human rights,
                challenges discrimination, promotes equality, and maintains the
                dignity of patients and carers.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will ensure I treat my clinical and non-clinical colleagues
                with respect, promoting a culture of teamworking across all
                professions working in healthcare.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will maintain my General Medical Council (GMC) registration
                with a licence to practise (even if temporarily out of
                programme). For all trainees, failure to do so may result in a
                police investigation, immediate exclusion from employment and
                referral to the GMC. Failure to do so may also result in my
                removal from the training programme.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I understand my responsibilities within revalidation, that I
                must declare my full scope of practice (including locum
                positions) and that I will provide evidence for all areas of
                activity. I understand that my Responsible Officer is the
                Postgraduate Dean and that Health Education England (HEE), NHS
                Education for Scotland (NES), HEIW or the Northern Ireland
                Medical and Dental Training Agency (NIMDTA) is my designated
                body.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • If starting at F1 level, I will have achieved a primary
                medical qualification as recognised by the GMC and obtained
                provisional registration by the time I am scheduled to commence
                the F1 year. I understand that I will need to obtain full
                registration with the GMC in advance of commencing as a F2
                doctor.
              </SummaryList.Value>{" "}
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will ensure that when carrying out work in a general
                practice setting, I am on the GP Performers List (specialty
                trainees only).
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I agree that I will only assume responsibility for or perform
                procedures in areas where I have sufficient knowledge,
                experience and expertise as set out by the GMC, my employers and
                my clinical supervisors.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will have adequate insurance and indemnity cover, in
                accordance with GMC guidance. I understand that personal
                indemnity cover is also strongly recommended.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will inform my Responsible Officer, HEE/NES/HEIW/NIMDTA and
                my employer immediately if I am currently under investigation by
                the police, the GMC/General Dental Council (GDC), NHS Resolution
                (formerly the National Clinical Assessment Service) or other
                regulatory body, and I will inform my Responsible Officer and
                HEE/NES/HEIW/NIMDTA if I am under investigation by my employer.
                I also agree to share information on the progress of any
                investigations.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will inform my Responsible Officer, HEE/NES/HEIW/NIMDTA and
                my employer immediately if the MTPS or GMC/GDC place any
                conditions (interim or otherwise) on my licence, or if I am
                suspended or erased/removed from the Medical or Dental
                Register/Performers List , or if NHS England take action to
                restrict my ability to work as a doctor or a dentist.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will provide my employer and HEE/NES/HEIW/NIMDTA with
                adequate notice as per GMC guidance/contract requirements if I
                wish to resign from my post/training programme.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will maintain a prescribed connection with
                HEE/NES/HEIW/NIMDTA, work in an approved practice setting until
                my GMC revalidation date (this applies to all doctors granted
                full registration after 2 June 2014) and comply with all
                requirements regarding the GMC revalidation process.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will ensure that I comply with the standards required from
                doctors when engaging with social media, and I will adhere to my
                employer’s policy on social media and GMC guidance.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I acknowledge that as an employee in a healthcare
                organisation, I accept the responsibility to abide by and work
                effectively as an employee for that organisation; this includes
                familiarity with policies, participating in pre-employment
                checks and occupational health assessments, employer and
                departmental inductions, and workplace-based appraisal as well
                as educational appraisal. I acknowledge and agree to the need to
                share information about my performance as a doctor in training
                with other organisations (e.g. employers, medical schools, the
                GMC, Colleges/training bodies involved in my training) and with
                the Postgraduate Dean on a regular basis
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I acknowledge that data will be collected to support the
                following processes and I will comply with the requirements of
                the General Data Protection Regulation (GDPR) May 2018, Data
                Protection Act (DPA) 2018 and other such data protection as is
                in force from time to time: a) Managing the provision of
                training programmes b) Managing processes allied to training
                programmes, such as certification, evidence to support
                revalidation and supporting the requirements of regulators c)
                Quality assurance of training programmes d) Workforce planning
                e) Ensuring and improving patient safety f) Compliance with
                legal and regulatory responsibilities, including monitoring
                under the Equality Act 2010 g) Research related to any of the
                above
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will maintain regular contact with my Training Programme
                Director, other trainers and HEE/NES/HEIW/NIMDTA by responding
                promptly to communications from them.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will participate proactively in the appraisal, assessment
                and programme planning process, including providing
                documentation that will be required to the prescribed timescales
                and progressing my training without unreasonable delay.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will ensure that I develop and keep up to date my learning
                e-portfolio, which underpins the training process and documents
                my progress through the programme.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I agree to ensure timely registration with the appropriate
                College/Faculty.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I will support the development and evaluation of my training
                programme by participating actively in the national annual GMC
                Trainee Survey/programme specific surveys as well as any other
                activities that contribute to the quality improvement of
                training.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                • I acknowledge that where programmes are time dependant,
                failure to complete the required time in programme may result in
                an unsatisfactory outcome.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                In addition, I acknowledge the following specific information
                requirements:
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                1. I understand that programme and post allocations are
                provisional and subject to change until confirmed by HEE/NES/
                HEIW/NIMDTA and/or my employing organisation.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                2. I understand that I will need to satisfy all requirements of
                the programme and curriculum to enable satisfactory sign off,
                and that this may require a specific time commitment.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                3. I agree to the following: a) I will obtain and provide my
                School and HEE/NES/HEIW/NIMDTA with a professional email
                address. b) I will inform my School and HEE/NES/HEIW/NIMDTA of
                any change of my personal contact details and/or personal
                circumstances that may affect my training programme
                arrangements. c) I will keep myself up to date with the latest
                information available via HEE/NES/HEIW/NIMDTA as well as via the
                relevant educational and regulatory websites. d) I will attend
                the minimum number of formal teaching days as required by my
                School/programme.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                4. Where applicable, I will fully engage with immigration and
                employer requirements relating to Tier 2 and Tier 4 UK visas.
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </Card.Content>
      </Card>
    </>
  );
};

export default CojAug22;
