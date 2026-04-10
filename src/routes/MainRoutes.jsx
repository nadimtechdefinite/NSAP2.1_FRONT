import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
// import PFMSRegistration from 'components/sanction/PFMSRegistration';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const AddMasterUser = Loadable(lazy(() => import('components/masters/users/AddUser')));
const UpdateMasterUser = Loadable(lazy(() => import('components/masters/users/UpdateUser')));

/* const AddAccessControlUser = Loadable(lazy(() => import('components/masters/access-control/AddUser')));
const UpdateAccessControlUser = Loadable(lazy(() => import('components/masters/access-control/UpdateUser'))); */

const AddMinistry = Loadable(lazy(() => import('components/masters/ministry/AddMinistry')));
const UpdateMinistry = Loadable(lazy(() => import('components/masters/ministry/UpdateMinistry')));

const AddRoleMaster = Loadable(lazy(() => import('components/masters/role/AddRole')));
const UpdateRoleMaster = Loadable(lazy(() => import('components/masters/role/UpdateRole')));

const AddStateMaster = Loadable(lazy(() => import('components/masters/state/AddState')));
const UpdateStateMaster = Loadable(lazy(() => import('components/masters/state/UpdateState')));

const AddDistrictMaster = Loadable(lazy(() => import('components/masters/district/AddDistrict')));
const UpdateDistrictMaster = Loadable(lazy(() => import('components/masters/district/UpdateDistrict')));

const AddSubDistrictMaster = Loadable(lazy(() => import('components/masters/sub-district/AddSubDistrict')));
const UpdateSubDistrictMaster = Loadable(lazy(() => import('components/masters/sub-district/UpdateSubDistrict')));

const AddGramPanchayatMaster = Loadable(lazy(() => import('components/masters/gram-panchayat/AddGramPanchayat')));
const UpdateGramPanchayatMaster = Loadable(lazy(() => import('components/masters/gram-panchayat/UpdateGramPanchayat')));

const AddVillageMaster = Loadable(lazy(() => import('components/masters/Village-master/AddVillageMaster')));
const VillageMasterUpdate = Loadable(lazy(() => import('components/masters/Village-master/VillageMasterUpdate')));

const AddHabitationMaster = Loadable(lazy(() => import('components/masters/habitation/AddHabitation')));
const UpdateHabitationMaster = Loadable(lazy(() => import('components/masters/habitation/UpdateHabitation')));

const AddCriteriaMaster = Loadable(lazy(() => import('components/masters/criteria/AddCriteria')));
const UpdateCriteriaMaster = Loadable(lazy(() => import('components/masters/criteria/UpdateCriteria')));
const ViewCriteria = Loadable(lazy(() => import('components/masters/criteria/ViewCriteria')));
const SingleCriteriaUpdate = Loadable(lazy(() => import('components/masters/criteria/SingleCriteriaUpdate')));
const GenerateSanctionOrder = Loadable(lazy(() => import('components/sanction/GenerateSanctionOrder')));
const GenerateSanctionOrderNew = Loadable(lazy(() => import('components/sanction/GenerateSanctionOrderNew')));
const ViewSanctionOrder = Loadable(lazy(() => import('components/sanction/ViewSanctionOrder')));
const PrintSanctionOrder = Loadable(lazy(() => import('components/sanction/PrintSanctionOrder')));
const RemoveUidData = Loadable(lazy(() => import('components/verification/removeUidData/RemoveUidData')));
const ApproveRemoveUidData = Loadable(lazy(() => import('components/verification/removeUidData/ApproveRemoveUidData')));

const UpdateMobileNumber = Loadable(lazy(() => import('components/verification/update-mobile-number/UpdateMobileNumber')));
const EnableReRegistration = Loadable(lazy(() => import('components/verification/enable-re-registration/EnableReRegistration')));
const MarkNSAPBeneficiaryRecord = Loadable(lazy(() => import('components/verification/mark-nsap-beneficiary/MarkNSAPBeneficiary')));
const ApproveMarkNSAPBeneficiaryRecord = Loadable(
  lazy(() => import('components/verification/mark-nsap-beneficiary/ApproveMarkNSAPBeneficiary'))
);
const ApproveMarkNSAPBeneficiarySubDis = Loadable(
  lazy(() => import('components/verification/mark-nsap-beneficiary/ApproveMarkNSAPBeneficiarySubDis'))
);
const ApproveMarkNSAPBeneficiaryGP = Loadable(
  lazy(() => import('components/verification/mark-nsap-beneficiary/ApproveMarkNSAPBeneficiaryGP'))
);
const ApproveMarkNSAPBeneficiaryLevelData = Loadable(
  lazy(() => import('components/verification/mark-nsap-beneficiary/ApproveMarkNSAPBeneficiaryLevelData'))
);
const PfmsPaymentFailedDetails = Loadable(
  lazy(() => import('components/verification/pfmsPaymentFailedDetailsReport/PfmsPaymentFailedDetails'))
);

const AddNewApplications = Loadable(lazy(() => import('components/identification/new-applications/add')));
const UpdateNewApplications = Loadable(lazy(() => import('components/identification/new-applications/update/ModifyDetails')));

const AddExistingPensioner = Loadable(lazy(() => import('components/identification/existing-pensioners/add')));
const UpdateExistingPensioner = Loadable(lazy(() => import('components/identification/existing-pensioners/update')));

const AddComputePension = Loadable(lazy(() => import('components/computation/computePension')));
const AfterComputationPage = Loadable(lazy(() => import('components/computation/computationDetailsAfterCompuation')));

const ReInstatePension = Loadable(lazy(() => import('components/discontinue/reInstatePension')));

const ReInstatePensionApproval = Loadable(lazy(() => import('components/discontinue/reInstatePensionApproval')));

const ReInstatePensionReport = Loadable(lazy(() => import('components/discontinue/reInstatePensionReport')));

const PushPaymentFile = Loadable(lazy(() => import('components/pushPaymentFile/pushPaymentFile')));

const PFMSPaymentSummary = Loadable(lazy(() => import('components/PFMSPaymentSummary/pfmsPaymentSummary')));

const PFMSRegistrationSummary = Loadable(lazy(() => import('components/PFMSRegistrationSummary/pfmsFileRegistrationSummary')));

const PFMSRegisteredAbstractReport = Loadable(lazy(() => import('components/PFMSRegistrationSummary/pfmsRegisteredAbstractReport')));

const NFBSClaimantReport = Loadable(lazy(() => import('components/reports/NFBSClaimantReport/nfbsClaimantSummary')));

const PFMSRegistrationVerification = Loadable(
  lazy(() => import('components/verification/PMFSRegistrationVerification/pfmsRegistrationVerification'))
);

const AnnualVerificationReport = Loadable(lazy(() => import('components/reports/AnnualVerificationReport/AnnualVerificationSummary')));

const StateTransactionReport = Loadable(
  lazy(() => import('components/reports/DisbursementReport/StateTransactionReport/stateTransactionReport'))
);

const APBAbstractReport = Loadable(lazy(() => import('components/reports/DisbursementReport/APBAbstractReport/APBAbstractReport')));

const DisbursementTransactionMonthWiseReport = Loadable(
  lazy(() => import('components/reports/DisbursementReport/DisbursementTransactionMonthWiseReport/DisbursementTransactionMonthWiseReport'))
);

const PFMSPendingFileReport = Loadable(lazy(() => import('components/reports/PFMSFilePendingReport/PFMSFilePendingReport')));

const MonthlyProgressReport1 = Loadable(lazy(() => import('components/MPR/MonthlyProgressReport1')));

const MonthlyProgressReport2 = Loadable(lazy(() => import('components/MPR/MonthlyProgressReport2')));

const PensionerDLCReport = Loadable(lazy(() => import('components/reports/PensionerDLCReport/PensionerDLCReport')));

const AnnualProgressReport = Loadable(lazy(() => import('components/reports/AnnualProgressReport/AnnualProgressReport')));

const NewEntryDetailReport = Loadable(lazy(() => import('components/reports/NewEntryDetailsReport/NewEntryDetailReport')));

const AgeAbstractAllStateReport = Loadable(lazy(() => import('components/reports/AgeAbstractReport/AgeAbstractAllStateReport')));

const MarkNsapAllStateReport = Loadable(lazy(() => import('components/reports/MarkNsapReport/MarkNsapReport')));

const MarkNsapPendingForApprovalReport = Loadable(lazy(() => import('components/reports/MarkNsapReport/MarkNsapPendingForApprovalReport')));

const InvalidPensionerDetails = Loadable(lazy(() => import('components/verification/invalidPensionerDetails/InvalidPensionerDetails')));

const AadharDownloadInExcel = Loadable(lazy(() => import('components/verification/aadharDownloadInExcel/AadharDownloadInExcel')));

const CPSMSRegisteredPensioner = Loadable(lazy(() => import('components/verification/cpsmsID/CPSMSRegisteredPensioner')));

const CheckUserDuplicacy = Loadable(lazy(() => import('components/verification/userDuplicacy/CheckUserDuplicacy')));

const ComputationAndDBTPaymentStatus = Loadable(
  lazy(() => import('components/reports/ComputationAndDBTPaymentStatus/ComputationAndDBTPaymentStatus'))
);

const AddApplicationForPendingVerification = Loadable(
  lazy(() => import('components/verification/application-pending-for-verification/applicationPendingForVerification'))
);

const AadharConsentUpdation = Loadable(lazy(() => import('components/verification/aadharConsentUpdation/AadharConsentUpdation')));
const ApproveAadharConsentUpdation = Loadable(
  lazy(() => import('components/verification/aadharConsentUpdation/ApproveAadharConsentUpdation'))
);

const AccountBankDetailsUpdation = Loadable(lazy(() => import('components/verification/accountBankUpdation/AccountBankDetailsUpdation')));
const ApproveAccountBankDetailsUpdation = Loadable(
  lazy(() => import('components/verification/accountBankUpdation/ApproveAccountBankDetailsUpdation'))
);
const BeneficiaryRegistrationFile = Loadable(
  lazy(() => import('components/reports/BeneficiaryRegistrationFile/BeneficieryRegistrationFile'))
);

const PfmsAgencyAdd = Loadable(lazy(() => import('components/masters/pfmsAgency/AddPfmsAgency')));
const AddPfmsAgencyConfig = Loadable(lazy(() => import('components/masters/pfmsAgency/AddPfmsAgencyConfig')));
const Adddiscontinue = Loadable(lazy(() => import('components/discontinue/discontinue')));
const Aprvdiscontinue = Loadable(lazy(() => import('components/discontinue/DiscontinueApprovel')));

const AddPfmsAgencyConfigUpdate = Loadable(lazy(() => import('components/masters/pfmsAgency/AddPfmsAgencyConfigUpdate')));
const UpdateAgencyMaster = Loadable(lazy(() => import('components/masters/pfmsAgency/UpdateAgencyMaster')));
const AddSchemeMaster = Loadable(lazy(() => import('components/masters/scheme-master/SchemeAdd')));
const UpdateSchemeMaster = Loadable(lazy(() => import('components/masters/scheme-master/UpdateScheme')));
const AddDisbursementMaster = Loadable(lazy(() => import('components/masters/disbursement-master/DisbursementAdd')));
const UpdateDisbursementMaster = Loadable(lazy(() => import('components/masters/disbursement-master/DisbursementUpdate')));
const AddCataoryMaster = Loadable(lazy(() => import('components/masters/catagory-master/CatagoryAdd')));
const UpdateCataoryMaster = Loadable(lazy(() => import('components/masters/catagory-master/CatagoryUpdate')));
const AddBankMaster = Loadable(lazy(() => import('components/masters/bank-master/BankAdd')));
const UpdateBankMaster = Loadable(lazy(() => import('components/masters/bank-master/BankUpdate')));
const AddBranchMaster = Loadable(lazy(() => import('components/masters/branch-master/BranchAdd')));
const UpdateBranchMaster = Loadable(lazy(() => import('components/masters/branch-master/BranchUpdate')));
const PFMSRegistration = Loadable(lazy(() => import('components/sanction/PFMSRegistration')));
const AddPensionAmountMaster = Loadable(lazy(() => import('components/masters/amount-master/PensionAmountMasterAdd')));
const UpdatePensionAmountMaster = Loadable(lazy(() => import('components/masters/amount-master/PensionAmountMasterUpdate')));
const DemandGeneration = Loadable(lazy(() => import('components/demandgenerate/demandgeneration')));
const AssignRoleAdd = Loadable(lazy(() => import('components/masters/AssignRole-Master/AssignRoleAdd')));
const AssignRoleUpdate = Loadable(lazy(() => import('components/masters/AssignRole-Master/AssignRoleUpdate')));
const AddRoleMenuMaster = Loadable(lazy(() => import('components/masters/role-menu-master/AddRoleMenuMaster')));
const UpdateRoleMenuMaster = Loadable(lazy(() => import('components/masters/role-menu-master/UpdateRoleMenuMaster')));
const TransferSanctionOrder = Loadable(lazy(() => import('components/sanction/TransferSanctionOrder')));
const AcceptSanctionOrder = Loadable(lazy(() => import('components/sanction/ApproveTransferOrder')));
const AdvanceSearch = Loadable(lazy(() => import('components/Utility/AdvanceSearch/AdvanceSearch')));
const DigitalSignatureRegistration = Loadable(lazy(() => import('components/digitalSignature/DigitalSignatureRegistration')));
const AadhaarAbstractReport = Loadable(lazy(() => import('components/reports/AadhaarAbstractReport/aadhaarAbstractReport')));
const ContactNoAbstract = Loadable(lazy(() => import('components/reports/ContactNoAbstract/ContactNoAbstract')));
const TransactionBased = Loadable(lazy(() => import('components/reports/TransactionBasedReport/TransactionBasedReport')));
const MobileNoAbstractAdmin = Loadable(lazy(() => import('components/reports/MobileNoAbstractAdminReport/MobileNoAbstractAdmin')));
const PensionersProgressiveAbstract = Loadable(
  lazy(() => import('components/reports/PensionersProgressiveAbstract/PensionersProgressiveAbstract'))
);
const NFBSBeneficiariesSanctionedReceivedBenefits = Loadable(
  lazy(() => import('components/reports/NFBSBeneficiariesSanctionedReceivedBenefits/NFBSBeneficiariesSanctionedReceivedBenefits'))
);
const AgeAbstractReport = Loadable(lazy(() => import('components/Utility/AgeAbstractReport/AgeAbstractReport')));
const MappingLocation = Loadable(lazy(() => import('components/Utility/MappingLocation/MappingLocation')));
const SocialAuditReport = Loadable(lazy(() => import('components/SocialAuditReport/SocialAuditUploadModule')));
const DSCStatus = Loadable(lazy(() => import('components/digitalSignature/DSCStatus')));
const RaiseComplian = Loadable(lazy(() => import('components/ComplainManagement/RaiseComplain')));
const ComplianStatus = Loadable(lazy(() => import('components/ComplainManagement/ComplainStatus')));
const ComplainAttend = Loadable(lazy(() => import('components/ComplainManagement/ComplainAttend')));
const ComplainReport = Loadable(lazy(() => import('components/ComplainManagement/ComplainReport')));
const MigrationLogReport = Loadable(lazy(() => import('components/reports/MigrationLogReport/MigrationLogReport')));
// const PFMSRegistration=Loadable(lazy(()=>import('components/sanction/PFMSRegistration')));
const ComputationReset = Loadable(lazy(() => import('components/computation/ComputationReset')));
const SchemeUniverseUpdation = Loadable(lazy(() => import('components/Utility/SchemeUniverseUpdation/index')));
const MigratePensioner = Loadable(lazy(() => import('components/Utility/MigratePensioner/index')));
const SubSchemeWiseReport = Loadable(lazy(() => import('components/reports/SubSchemeWiseReport')));
const SchemeWiseFundReport = Loadable(lazy(() => import('components/reports/SchemeWiseFundReport/SchemeWiseFundReport')));
const LedgerHistoryReport = Loadable(lazy(() => import('components/reports/LedgerHistoryReport/ledgerHistoryReport')));
const MonthlyFundDisbursementEntryReport = Loadable(
  lazy(() => import('components/reports/MonthlyFundDisbursementEntry/monthlyFundDisbursementEntryreport'))
);

const RegisterdAccountVerificationReport = Loadable(lazy(() => import('components/reports/RegisterdAccountVerification')));

const PensionersLinkedWithBankAndPOAndMOAndCashReport = Loadable(
  lazy(() => import('components/reports/PensionersLinkedWithBankAndPOAndMOAndCash'))
);

const BeneficieryRegistrationReport = Loadable(
  lazy(() => import('components/reports/BeneficieryregistrationReport/BeneficieryRegistrationReport'))
);
const DownloadDataAtGpLevel = Loadable(lazy(() => import('components/Utility/DownloadDataAtGpLevel/index')));
const DataDownloadInCsvAndMdb = Loadable(lazy(() => import('components/Utility/DataDownloadInCsvAndMdb/index')));
const LedgerUpdate = Loadable(lazy(() => import('components/UpdateLedger/UpdateLedger')));
const DisabilityReport = Loadable(lazy(() => import('components/reports/DisabilityReport/DisabilityReport')));
const RegistrationModesReport = Loadable(lazy(() => import('components/reports/RegistrationModesReport/RegistrationModes')));
const GenderAndCategoryReport = Loadable(lazy(() => import('components/reports/GenderAndSocialCategoryReport/GenderAndSocialCategory')));

const DiscontinueReport = Loadable(lazy(() => import('components/reports/DiscontinueReport/DiscontinueReport')));
const DiscontinueReasonReport = Loadable(lazy(() => import('components/reports/DiscontinueReasonReport/DiscontinueReasonReport')));
const AbstractReport = Loadable(lazy(() => import('components/reports/AbstractReport/index')));
const NPCIChargesReport = Loadable(lazy(() => import('components/reports/NPCIReports/NPCIChargesReport')));

const SavingDetailsReport = Loadable(lazy(() => import('components/reports/SavingDetailsReport/savingDetailsReport')));
const DownloadBeneficiaryData = Loadable(lazy(() => import('components/reports/DownloadBeneficiaryData/DownloadBeneficiaryData')));

const RoleBaseMenu = Loadable(lazy(() => import('components/masters/role-menu-master/add')));

const UserLogReport = Loadable(lazy(() => import('components/reports/LogsReport/UserLogReport')));

const MobileOtpReport = Loadable(lazy(() => import('components/reports/LogsReport/MessageMobileOTP')));
const BeneficiariesCoveredReport = Loadable(lazy(() => import('components/reports/BeneficiariesCoveredReport/BeneficiariesCoveredReport')));
const StatusOfBoardedUnboardedState = Loadable(
  lazy(() => import('components/reports/StatusOfBoardedUnboardedState/ShowBoardedUnboardedStateStatus'))
);

const AadharDigitizationReport = Loadable(lazy(() => import('components/reports/AadharReports/AadharDigitizationReport')));
const FTOTransactionReport = Loadable(lazy(() => import('components/reports/FTOReport/FTOTransactionReport')));

const DobUpdation = Loadable(lazy(() => import('components/verification/DOBUpdation/DobUpdation')));
const ApproveDobDetailsUpdation = Loadable(lazy(() => import('components/verification/DOBUpdation/ApproveDobDetailsUpdation')));
const VerificationForm = Loadable(lazy(() => import('components/verification/Verification-Form/VerificationForm')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },

    {
      children: [
        {
          path: '/masters/users/add',
          element: <AddMasterUser />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/users/update',
          element: <UpdateMasterUser />
        }
      ]
    },

    {
      children: [
        {
          path: '/masters/ministry/add',
          element: <AddMinistry />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/ministry/update',
          element: <UpdateMinistry />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/role/add',
          element: <AddRoleMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/role/update',
          element: <UpdateRoleMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/state/add',
          element: <AddStateMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/state/update',
          element: <UpdateStateMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/district/add',
          element: <AddDistrictMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/district/update',
          element: <UpdateDistrictMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/sub-district/add',
          element: <AddSubDistrictMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/sub-district/update',
          element: <UpdateSubDistrictMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/gram-panchayat/add',
          element: <AddGramPanchayatMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/gram-panchayat/update',
          element: <UpdateGramPanchayatMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/village/add',
          element: <AddVillageMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/village/update',
          element: <VillageMasterUpdate />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/habitation/add',
          element: <AddHabitationMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/habitation/update',
          element: <UpdateHabitationMaster />
        }
      ]
    },

    {
      children: [
        {
          path: '/masters/criteria/add',
          element: <AddCriteriaMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/masters/criteria/update',
          element: <UpdateCriteriaMaster />
        }
      ]
    },

    {
      children: [
        {
          path: '/masters/criteria/view',
          element: <ViewCriteria />
        }
      ]
    },

    {
      children: [
        {
          path: '/masters/criteria/singleUpdate',
          element: <SingleCriteriaUpdate />
        }
      ]
    },

    {
      children: [
        {
          path: '/sanction/generatesanctionold',
          element: <GenerateSanctionOrder />
        }
      ]
    },
    {
      children: [
        {
          path: '/sanction/generatesanction',
          element: <GenerateSanctionOrderNew />
        }
      ]
    },
    {
      children: [
        {
          path: '/sanction/viewsanction',
          element: <ViewSanctionOrder />
        }
      ]
    },
    {
      children: [
        {
          path: '/sanction/printsanction',
          element: <PrintSanctionOrder />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/removeUidData',
          element: <RemoveUidData />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/approveRemoveUidData',
          element: <ApproveRemoveUidData />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/updateMobileNumber',
          element: <UpdateMobileNumber />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/enableReRegistration',
          element: <EnableReRegistration />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/markNSAPBeneficiary',
          element: <MarkNSAPBeneficiaryRecord />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/approveMarkNSAPBeneficiary',
          element: <ApproveMarkNSAPBeneficiaryRecord />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/approveMarkNSAPBeneficiarySubDis',
          element: <ApproveMarkNSAPBeneficiarySubDis />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/approveMarkNSAPBeneficiaryGP',
          element: <ApproveMarkNSAPBeneficiaryGP />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/approveMarkNSAPBeneficiaryLevelData',
          element: <ApproveMarkNSAPBeneficiaryLevelData />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/pfmsRejectedPensioner',
          element: <PfmsPaymentFailedDetails />
        }
      ]
    },
    {
      children: [
        {
          path: '/identification/new-applications/add',
          element: <AddNewApplications />
        }
      ]
    },

    {
      children: [
        {
          path: '/identification/new-applications/update',
          element: <UpdateNewApplications />
        }
      ]
    },
    {
      children: [
        {
          path: '/identification/existing-pensioners/add',
          element: <AddExistingPensioner />
        }
      ]
    },

    {
      children: [
        {
          path: '/identification/existing-pensioners/update',
          element: <UpdateExistingPensioner />
        }
      ]
    },
    {
      children: [
        {
          path: '/computation/computePension',
          element: <AddComputePension />
        }
      ]
    },
    {
      children: [
        {
          path: '/computation/computationDetailsAfterCompuation',
          element: <AfterComputationPage />
        }
      ]
    },
    {
      children: [
        {
          path: '/discontinue/Reinstate',
          element: <ReInstatePension />
        }
      ]
    },
    {
      children: [
        {
          path: '/discontinue/ReInstateApproval',
          element: <ReInstatePensionApproval />
        }
      ]
    },
    {
      children: [
        {
          path: '/discontinue/ReInstateReport',
          element: <ReInstatePensionReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/computation/pushPaymentFile',
          element: <PushPaymentFile />
        }
      ]
    },
    {
      children: [
        {
          path: '/computation/PFMSPaymentSummary',
          element: <PFMSPaymentSummary />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/PFMSRegistrationSummary',
          element: <PFMSRegistrationSummary />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/PFMSRegisteredAbstractReport',
          element: <PFMSRegisteredAbstractReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/application-pending-for-verification/applicationPendingForVerification',
          element: <AddApplicationForPendingVerification />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/aadharConsentUpdation',
          element: <AadharConsentUpdation />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/approveAadharConsentUpdation',
          element: <ApproveAadharConsentUpdation />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/accountBankDetailsUpdation',
          element: <AccountBankDetailsUpdation />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/approveAccountBankDetailsUpdation',
          element: <ApproveAccountBankDetailsUpdation />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/pfms-agency/addConfig',
          element: <AddPfmsAgencyConfig />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/pfms-agency/updateConfig',
          element: <AddPfmsAgencyConfigUpdate />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/pfms-agency/update',
          element: <UpdateAgencyMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/pfms-agency/add',
          element: <PfmsAgencyAdd />
        }
      ]
    },
    {
      children: [
        {
          path: '/discontinue/discontinue',
          element: <Adddiscontinue />
        }
      ]
    },

    {
      children: [
        {
          path: '/discontinue/DiscontinueApprovel',
          element: <Aprvdiscontinue />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/scheme-master/addScheme',
          element: <AddSchemeMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/scheme-master/updateScheme',
          element: <UpdateSchemeMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/disbursement-master/addDisbursement',
          element: <AddDisbursementMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/disbursement-master/updateDisbursement',
          element: <UpdateDisbursementMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/catagory-master/addCatagory',
          element: <AddCataoryMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/catagory-master/updateCatagory',
          element: <UpdateCataoryMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/bank-master/addBank',
          element: <AddBankMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/bank-master/updateBank',
          element: <UpdateBankMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/branch-master/addBranch',
          element: <AddBranchMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/branch-master/updateBranch',
          element: <UpdateBranchMaster />
        }
      ]
    },

    {
      children: [
        {
          path: '/master/amount-master/addAmount',
          element: <AddPensionAmountMaster />
        }
      ]
    },

    {
      children: [
        {
          path: '/master/amount-master/updateAmount',
          element: <UpdatePensionAmountMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/AnnualProgressReport',
          element: <AnnualProgressReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/computation/GenerateDemand',
          element: <DemandGeneration />
        }
      ]
    },
    {
      children: [
        {
          path: '/sanction/PFMSRegistration',
          element: <PFMSRegistration />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/amount-master/addAssignRole',
          element: <AssignRoleAdd />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/amount-master/updateAssignRole',
          element: <AssignRoleUpdate />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/role-menu-master/addRoleMenu',
          element: <AddRoleMenuMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/role-menu-master/addUpdate',
          element: <RoleBaseMenu />
        }
      ]
    },
    {
      children: [
        {
          path: '/master/role-menu-master/updateRoleMenu',
          element: <UpdateRoleMenuMaster />
        }
      ]
    },
    {
      children: [
        {
          path: '/sanction/transferSanction',
          element: <TransferSanctionOrder />
        }
      ]
    },
    {
      children: [
        {
          path: '/sanction/acceptSanctionOrder',
          element: <AcceptSanctionOrder />
        }
      ]
    },
    {
      children: [
        {
          path: '/Utility/AdvanceSearch',
          element: <AdvanceSearch />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/NFBSClaimantReport',
          element: <NFBSClaimantReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/PFMSRegistrationVerification',
          element: <PFMSRegistrationVerification />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/AnnualVerificationReport',
          element: <AnnualVerificationReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/StateTransactionReport',
          element: <StateTransactionReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/APBAbstract',
          element: <APBAbstractReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/DisbursementTransactionMonthWiseReport',
          element: <DisbursementTransactionMonthWiseReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/PFMSPendingFileReport',
          element: <PFMSPendingFileReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/AgeAbstractAllStateReport',
          element: <AgeAbstractAllStateReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/MarkNsapAllStateReport',
          element: <MarkNsapAllStateReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/MarkNsapPendingForApprovalReport',
          element: <MarkNsapPendingForApprovalReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/mpr/MonthlyProgressReport1',
          element: <MonthlyProgressReport1 />
        }
      ]
    },
    {
      children: [
        {
          path: '/mpr/MonthlyProgressReport2',
          element: <MonthlyProgressReport2 />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/NewEntryDetailReport',
          element: <NewEntryDetailReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/Report/aadhaarAbstractReport',
          element: <AadhaarAbstractReport />
        }
      ]
    },

    {
      children: [
        {
          path: '/report/contactNoAbstract',
          element: <ContactNoAbstract />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/transactionBased',
          element: <TransactionBased />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/mobileNoAbstractAdmin',
          element: <MobileNoAbstractAdmin />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/pendingPensionersProgressiveAbstract',
          element: <PensionersProgressiveAbstract />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/computationAndDBTPaymentStatus',
          element: <ComputationAndDBTPaymentStatus />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/nfbsBeneficiariesSanctionedReceivedBenefits',
          element: <NFBSBeneficiariesSanctionedReceivedBenefits />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/invalidPensioner',
          element: <InvalidPensionerDetails />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/aadharDownloadInExcel',
          element: <AadharDownloadInExcel />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/cpsmsRegistered',
          element: <CPSMSRegisteredPensioner />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/checkUserDuplicacy',
          element: <CheckUserDuplicacy />
        }
      ]
    },
    {
      children: [
        {
          path: '/digitalSignature/digitalSignatureRegistration',
          element: <DigitalSignatureRegistration />
        }
      ]
    },
    {
      children: [
        {
          path: '/Utility/AgeAbstractReport',
          element: <AgeAbstractReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/Utility/MappingLocation',
          element: <MappingLocation />
        }
      ]
    },
    {
      children: [
        {
          path: '/SocialAudit/socialAuditReport',
          element: <SocialAuditReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/digitalSignature/DSCStatus',
          element: <DSCStatus />
        }
      ]
    },
    {
      children: [
        {
          path: '/complainManagement/RaiseComplain',
          element: <RaiseComplian />
        }
      ]
    },
    {
      children: [
        {
          path: '/complainManagement/ComplainStatus',
          element: <ComplianStatus />
        }
      ]
    },
    {
      children: [
        {
          path: '/complainManagement/RaiseComplain',
          element: <RaiseComplian />
        }
      ]
    },
    {
      children: [
        {
          path: '/complainManagement/ComplainStatus',
          element: <ComplianStatus />
        }
      ]
    },
    {
      children: [
        {
          path: '/complainManagement/ComplainReport',
          element: <ComplainReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/computation/pensionComputationReset',
          element: <ComputationReset />
        }
      ]
    },
    {
      children: [
        {
          path: '/Utility/SchemeUniverseUpdation',
          element: <SchemeUniverseUpdation />
        }
      ]
    },
    {
      children: [
        {
          path: '/Utility/MigratePensioner',
          element: <MigratePensioner />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/subSchemeWiseReport',
          element: <SubSchemeWiseReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/SchemeWiseFundReport',
          element: <SchemeWiseFundReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/registerdAccountVerification',
          element: <RegisterdAccountVerificationReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/migrationLog',
          element: <MigrationLogReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/ledgerHistory',
          element: <LedgerHistoryReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/DbtPortalEntry',
          element: <MonthlyFundDisbursementEntryReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/BeneficieryRegistrationReport',
          element: <BeneficieryRegistrationReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/pensionersLinkedWithBankAndPOAndMOAndCashReport',
          element: <PensionersLinkedWithBankAndPOAndMOAndCashReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/Utility/DownloadDataAtGpLevel',
          element: <DownloadDataAtGpLevel />
        }
      ]
    },
    {
      children: [
        {
          path: '/Utility/DataDownloadInCsvAndMdb',
          element: <DataDownloadInCsvAndMdb />
        }
      ]
    },
    {
      children: [
        {
          path: '/UpdateLedger/UpdateLedger',
          element: <LedgerUpdate />
        }
      ]
    },
    {
      children: [
        {
          path: '/DisabilityReport/DisabilityReport',
          element: <DisabilityReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/RegistrationModesReport/RegistrationModes',
          element: <RegistrationModesReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/GenderAndSocialCategoryReport/GenderAndSocialCategory',
          element: <GenderAndCategoryReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/discontinueReport',
          element: <DiscontinueReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/report/discontinueReasonReport',
          element: <DiscontinueReasonReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/complainManagement/ComplainAttend',
          element: <ComplainAttend />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/NPCIChargesReport',
          element: <NPCIChargesReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/abstractReport',
          element: <AbstractReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/SavingDetails',
          element: <SavingDetailsReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/DownloadBeneficiaryData',
          element: <DownloadBeneficiaryData />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/UserLogReport',
          element: <UserLogReport />
        }
      ]
    },

    {
      children: [
        {
          path: '/reports/MessageMobileOTP',
          element: <MobileOtpReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/BeneficiaryRegistrationFile',
          element: <BeneficiaryRegistrationFile />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/PensionerDLCReport',
          element: <PensionerDLCReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/StatusOfBoardedUnboardedState',
          element: <StatusOfBoardedUnboardedState />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/AadhaarDigitizationReport',
          element: <AadharDigitizationReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/BeneficiariesCoveredReport',
          element: <BeneficiariesCoveredReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/reports/FTOTransactionReport',
          element: <FTOTransactionReport />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/DobUpdation',
          element: <DobUpdation />
        }
      ]
    },
    {
      children: [
        {
          path: '/verification/ApproveDobDetailsUpdation',
          element: <ApproveDobDetailsUpdation />
        }
      ]
    },
     {
      children: [
        {
          path: '/verification/VerificationForm',
          element: <VerificationForm/>
        }
      ]
    }
  ]
};

export default MainRoutes;
