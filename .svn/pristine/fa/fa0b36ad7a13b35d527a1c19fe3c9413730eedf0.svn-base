import React from 'react';
import { Typography, Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FaqPage = () => {
  // Example data for questions and answers
  const faqs = [
    {
      question: 'What does NSAP stand for and when was it launched?',
      answer: 'NSAP stands for National Social Assistance Programme. It was launched on 15th August, 1995.'
    },
    // Add more questions and answers as needed
    {
      question: 'What is the justification for existence of NSAP?',
      answer:
        'The National Social Assistance Programme (NSAP) represents a significant step towards the fulfilment of the Directive Principles in Article 41 and 42 of the Constitution recognizing the concurrent responsibility of the Central and the State Governments in the matter. In particular, Article 41 of the Constitution of India directs the State to provide public assistance to its citizens in case of unemployment, old age, sickness and disablement and in other cases of undeserved want within the limit of its economic capacity and development.'
    },
    {
      question: 'What is the objective of NSAP?',
      answer:
        'In providing social assistance benefits to poor households in the case of old age, death of the breadwinner and maternity, the NSAP aims at ensuring minimum national standards, in addition to the benefits that the States are currently providing or might provide in future. It also aims at ensuring that social protection to the beneficiaries everywhere in the country is uniformly available without interruption.'
    },

    {
      question: 'What are the components of NSAP?',
      answer:
        'The NSAP at its inception in 1995 had three components namely (1) National Old Age Pension Scheme (NOAPS, (2) National Family Benefit Scheme (NFBS) and (3) National Maternity Benefit Scheme (NMBS). The National Maternity Benefit Scheme (NMBS) was subsequently transferred on 1st April, 2001 from the Ministry of Rural development to the Ministry of Health and Family Welfare. On 1st April, 2000 a new Scheme known as Annapurna Scheme was launched. This scheme aimed at providing food security to meet the requirement of those senior citizens who, though eligible, have remained uncovered under the NOAPS. In February 2009, two new Schemes known as Indira Gandhi National Widow Pension Scheme (IGNWPS) and Indira Gandhi National Disability Pension Scheme (IGNDPS) were introduced. Presently NSAP comprises of five schemes, namely - (1) Indira Gandhi National Old Age Pension Scheme (IGNOAPS), (2) Indira Gandhi National Widow Pension Scheme (IGNWPS), (3) Indira Gandhi National Disability Pension Scheme (IGNDPS), (4) National Family Benefit Scheme NFBS) and (5) Annapurna. '
    },

    {
      question: 'Who implements NSAP?',
      answer:
        'The NSAP is implemented in the States/UTs in accordance with the general conditions applicable to all components of the NSAP as well as specific condition applicable to each component. The NSAP Schemes are mainly implemented by the Social Welfare Departments in the States. But NSAP is implemented by Rural Development Department in the States of Andhra Pradesh, Assam, Goa, Meghalaya and West Bengal; by the Department of Women & Child Development in Orissa and Puducherry; by the Revenue Department in Karnataka and Tamil Nadu and by the Department of Labour Employment & Training in Jharkhand. The NSAP extends to both the rural as well as urban areas.'
    },
    {
      question: 'What is the basic eligibility criterion under NSAP?',
      answer:
        'For getting benefits under NSAP the applicant must belong to a Below Poverty Line (BPL) family according to the criteria prescribed by the Government of India.'
    },
    {
      question: 'How are the beneficiaries identified in rural areas?',
      answer:
        'As per the revised eligibility criteria new beneficiaries will be identified from BPL list prepared by the States/UTs as per guidelines issued by the Ministry of Rural Development (MORD) for the BPL Census 2002.'
    },

    {
      question: 'How will the identification of the beneficiaries be done in the urban areas?',
      answer:
        'Identification of eligible beneficiaries will be carried out as per the BPL list required to be prepared in connection with poverty alleviation programme off the ministry of Urban Housing and Poverty Alleviation.'
    },

    {
      question: 'What will be the position in respect of existing beneficiaries, whose names are not on the BPL list?',
      answer:
        'They will continue to get the pension as at present without any interruption notwithstanding the fact that their names are not borne on the BPL list, provided they were eligible as per the old criteria.'
    },

    {
      question: 'When were NSAP and Annapurna transferred to State Plan? Why? What is the effect of this transfer?',
      answer:
        'In the National Development Council Meeting held in January 1997 to discuss the Draft Approach to the Ninth Plan, several Chief Ministers of States suggested for transfer of the Centrally Sponsored Schemes to States. As per the Approach Paper to the Ninth Five Year Plan, it was emphasized that in principle Centrally Sponsored Schemes should be confined to schemes of an inter-state character, matters impinging on national security, selected national priorities where central supervision is essential for effective implementation. As a result of the review of the Centrally Sponsored Schemes by the Planning Commission in consultation with the Mo RD, it was decided to transfer NSAP and Annapurna to the State Plans from the year 2002-2003. Funds for these schemes are released as Additional Central Assistance. The funds are allocated by the Planning Commission and allocated among the States by the Ministry of Rural Development and the Planning Commission and released by the Ministry of Finance on the recommendation of M/o Rural Development.'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Typography variant="h1" gutterBottom>
        Frequently Asked Questions
      </Typography>
      {faqs.map((faq, index) => (
        <Accordion key={index} elevation={0} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
            <Typography variant="body1">
              <strong>{`Question ${index + 1}:`}</strong> {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              <strong>Answer:</strong> {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FaqPage;
