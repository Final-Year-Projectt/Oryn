
import {
  LayoutDashboard,
  UploadCloud,
  ShieldCheck,
  Database,
  AlertTriangle,
  Lightbulb,
  History,
  Bell,
  UserRound,
  Settings,
} from "lucide-react";

// Shared navigation configuration for ORYN.
// The sidebar, navbar headings and search use the same routes.
export const menuItems = [
  {
    name: "Overview",
    title: "Dashboard",
    subtitle: "Your business intelligence workspace",
    description: "Business overview and key metrics",
    path: "/dashboard",
    icon: LayoutDashboard,
    keywords:
      "home overview dashboard business health metrics performance",
  },
  {
    name: "Upload Data",
    title: "Upload Data",
    subtitle: "Upload business datasets for analysis",
    description: "Upload a CSV or Excel dataset",
    path: "/dashboard/upload",
    icon: UploadCloud,
    keywords:
      "file csv excel import new dataset upload spreadsheet",
  },
  {
    name: "Validation",
    title: "Validation",
    subtitle: "Review data quality and validation results",
    description: "Review dataset quality and issues",
    path: "/dashboard/validation",
    icon: ShieldCheck,
    keywords:
      "data quality missing values duplicates clean validate errors",
  },
  {
    name: "Datasets",
    title: "Datasets",
    subtitle: "Manage your uploaded business datasets",
    description: "Browse and manage uploaded datasets",
    path: "/dashboard/datasets",
    icon: Database,
    keywords:
      "files records source data inventory csv xlsx spreadsheet",
  },
  {
    name: "Problems",
    title: "Problems",
    subtitle: "Review and investigate business problems",
    description: "Review and investigate business problems",
    path: "/dashboard/problems",
    icon: AlertTriangle,
    keywords:
      "issues alerts critical severity findings customer churn sales decline inventory operations",
  },
  {
    name: "Recommendations",
    title: "Recommendations",
    subtitle: "Explore prioritized business solutions",
    description: "Explore prioritized business actions",
    path: "/dashboard/recommendations",
    icon: Lightbulb,
    keywords:
      "solutions actions suggestions impact effort priorities improve business",
  },
  {
    name: "Notifications",
    title: "Notifications",
    subtitle: "Review alerts and workspace activity",
    description: "Review alerts and unread workspace updates",
    path: "/dashboard/notifications",
    icon: Bell,
    keywords:
      "bell unread updates analysis uploads alerts messages activity notifications",
  },
  {
    name: "History",
    title: "History",
    subtitle: "Review previous analyses and activity",
    description: "Review earlier analyses and activity",
    path: "/dashboard/history",
    icon: History,
    keywords:
      "activity logs events past analyses records timeline previous",
  },
  {
    name: "My Profile",
    title: "My Profile",
    subtitle: "Manage account information and workspace identity",
    description: "View and update your account profile",
    path: "/dashboard/profile",
    icon: UserRound,
    keywords:
      "account user name email profile personal details avatar",
  },
  {
    name: "Settings",
    title: "Settings",
    subtitle: "Manage profile and workspace preferences",
    description: "Manage workspace and notification preferences",
    path: "/dashboard/settings",
    icon: Settings,
    keywords:
      "preferences alerts privacy business notification settings security",
  },
];
