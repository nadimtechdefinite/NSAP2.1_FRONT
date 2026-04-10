import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import HomeLayout from 'layout/HomeLayout';
const AspirationalDistrictReport = Loadable(lazy(() => import('components/reports/AspirationalDistrictReport')));
const SanctionOrderReleaseReport = Loadable(lazy(() => import('components/reports/SanctionOrderReleaseReport')));
const STCReport = Loadable(lazy(() => import('components/reports/STCReport')));
const BeneficiaryCountReport = Loadable(lazy(() => import('components/reports/BeneficiaryCountReport')));
const SocialAuditReport = Loadable(lazy(() => import('components/reports/SocialAuditReport')));
const NationalDashboardReport = Loadable(lazy(() => import('components/reports/NationalDashboardReport/nationaldashboard.js')));
const MonthlyProgressReport = Loadable(lazy(() => import('components/reports/MonthlyProgressReport')));
const DashboardReport = Loadable(lazy(() => import('components/reports/DashboardReport/dashboardreport.js')));
const SocialAuditReportForStatesAndAtn = Loadable(lazy(() => import('components/reports/SocialAuditReportForStatesAndAtn')));
const SeccAadhaarReport = Loadable(lazy(() => import('components/reports/SeccAadhaarReport/seccAadhaarReport')));
const ApplicationTrackerReport = Loadable(lazy(() => import('components/reports/ApplicationTrackerReport/ApplicationStatusTracker')));
const BeneficiaryAbstract = Loadable(lazy(() => import('components/reports/BeneficiaryAbstractReport/beneficiaryAbstract')));
const SanctionAbstract = Loadable(lazy(() => import('components/reports/SanctionAbstractReport/sanctionAbstractReport')));
const DisbursementAbstract = Loadable(lazy(() => import('components/reports/disbursementAbstractReport/disbursementAbstractReport')));
const ManagementDashboard = Loadable(lazy(() => import('components/reports/ManagementDashboard')));
const LGDSeedingStatusReport = Loadable(lazy(() => import('components/reports/LGDSeedingStatusReport/LGDSeedingStatusReport')));
const SocialAuditNewReport = Loadable(lazy(() => import('components/reports/SocialAuditNewReport/SocialAuditNewReport')));
const StateAbstract = Loadable(
  lazy(() => import('components/reports/StateAbstractPaymentModeAndAadhaar/StateAbstractPaymentModeAndAadhaarReport'))
);

const AgeAbstractReport = Loadable(lazy(() => import('components/reports/AgeAbstractReport/AgeAbstractAllStateReport')));

const LandingHomePage = Loadable(lazy(() => import('views/home')));
const AboutUsPage = Loadable(lazy(() => import('views/home/pages/about-us')));
const GuidelinesPage = Loadable(lazy(() => import('views/home/pages/guidelines')));

const ReportsPage = Loadable(lazy(() => import('views/home/pages/reports')));
const FaqPage = Loadable(lazy(() => import('views/home/pages/faq')));
const CircularsPage = Loadable(lazy(() => import('views/home/pages/circulars')));
const ContactUsPage = Loadable(lazy(() => import('views/home/pages/contact-us')));
const GalleryPage = Loadable(lazy(() => import('views/home/pages/gallery')));
const SitemapPage = Loadable(lazy(() => import('views/home/pages/sitemap')));
const ViewData = Loadable(lazy(() => import('components/reports/ManagementDashboard/ViewData')));

// ==============================|| HOME ROUTING ||============================== //

const HomeRoutes = {
  path: '/',
  element: <HomeLayout />,
  children: [
    {
      path: '/home',
      element: <LandingHomePage />
    },
    {
      path: '/about',
      element: <AboutUsPage />
    },
    {
      path: '/guidelines',
      element: <GuidelinesPage />
    },
    {
      path: '/reports',
      element: <ReportsPage />
    },
    {
      path: '/faq',
      element: <FaqPage />
    },
    {
      path: '/circulars',
      element: <CircularsPage />
    },
    {
      path: '/contact',
      element: <ContactUsPage />
    },
    {
      path: '/gallery',
      element: <GalleryPage />
    },
    {
      path: '/sitemap',
      element: <SitemapPage />
    },
    {
      path: '/aspirationalDistrictReport',
      element: <AspirationalDistrictReport />
    },
    {
      path: '/sanctionOrderReleaseReport',
      element: <SanctionOrderReleaseReport />
    },
    {
      path: '/stcReport',
      element: <STCReport />
    },
    {
      path: '/beneficiaryCountReport',
      element: <BeneficiaryCountReport />
    },
    {
      path: '/nationalDashboardReport',
      element: <NationalDashboardReport />
    },
    {
      path: '/monthlyProgressReport',
      element: <MonthlyProgressReport />
    },
    {
      path: '/socialAuditReport',
      element: <SocialAuditReport />
    },
    {
      path: '/dashboardReport',
      element: <DashboardReport />
    },
    {
      path: '/socialAuditReportForStatesAndAtn',
      element: <SocialAuditReportForStatesAndAtn />
    },
    {
      path: '/outerReport/SeccAadhaarReport',
      element: <SeccAadhaarReport />
    },
    {
      path: '/outerReport/ApplicationTrackerReport',
      element: <ApplicationTrackerReport />
    },
    {
      path: '/BeneficiaryAbstractReport',
      element: <BeneficiaryAbstract />
    },
    {
      path: '/SanctionAbstractReport',
      element: <SanctionAbstract />
    },
    {
      path: '/DisbursementAbstractReport',
      element: <DisbursementAbstract />
    },
    {
      path: '/managementDashboard',
      element: <ManagementDashboard />
    },
    {
      path: '/lGDSeedingStatusReport',
      element: <LGDSeedingStatusReport />
    },
    {
      path: '/socialAuditNewReport',
      element: <SocialAuditNewReport />
    },
    {
      path: '/stateAbstractPaymentModeAndAadhaarReport',
      element: <StateAbstract />
    },
    {
      path: '/AgeAbstractReport',
      element: <AgeAbstractReport />
    },
    {
      path: '/viewData',
      element: <ViewData />
    }
  ]
};

export default HomeRoutes;
