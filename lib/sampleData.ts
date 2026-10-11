import { Report } from "./types";

export const SAMPLE_REPORTS: Omit<Report, "id">[] = [
  {
    title: "Large pothole on Main Road near Bus Stop 12",
    description:
      "There is a deep pothole approximately 40cm wide and 20cm deep on Main Road near Bus Stop 12. Several vehicles have been damaged and it is becoming a safety hazard, especially at night. The pothole has been growing larger over the past two weeks after recent rainfall.",
    category: "Roads and Potholes",
    location: "Main Road, Near Bus Stop 12, Sector 4",
    status: "In Progress",
    priority: "High",
    reporterName: "Rajesh Kumar",
    adminNotes:
      "Road maintenance team has been notified. Repair scheduled for next week.",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Report submitted by user.",
      },
      {
        status: "Under Review",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Report reviewed and verified by field team.",
      },
      {
        status: "In Progress",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Road maintenance team has been notified. Repair scheduled for next week.",
      },
    ],
  },
  {
    title: "Overflowing garbage bins near Park Entrance",
    description:
      "The municipal garbage bins near the park entrance on Green Avenue have been overflowing for the past four days. Waste is spilling onto the footpath and the surrounding area has a strong odor. Residents are concerned about health risks, especially during summer.",
    category: "Waste Management",
    location: "Green Avenue, Park Entrance, Sector 7",
    status: "Resolved",
    priority: "High",
    reporterName: "Priya Sharma",
    adminNotes: "Garbage cleared by sanitation team. Additional bin allocated.",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Report submitted by user.",
      },
      {
        status: "Under Review",
        timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Sanitation team dispatched for inspection.",
      },
      {
        status: "Resolved",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Garbage cleared by sanitation team. Additional bin allocated.",
      },
    ],
  },
  {
    title: "Three streetlights not working on Bridge Road",
    description:
      "Three consecutive streetlights on Bridge Road between the school and the hospital have been non-functional for over a week. The area is very dark at night and pedestrians feel unsafe. Parents are especially concerned as students walk this route in the evenings.",
    category: "Streetlights",
    location: "Bridge Road, Between School and District Hospital",
    status: "Under Review",
    priority: "Medium",
    reporterName: "Anil Mehta",
    adminNotes: "Electrical department has been informed.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Report submitted by user.",
      },
      {
        status: "Under Review",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Electrical department has been informed.",
      },
    ],
  },
  {
    title: "Waterlogging on Railway Colony Road after rain",
    description:
      "Railway Colony Road experiences severe waterlogging after every rain. Water accumulates to a depth of about 15–20 cm and stays for 2–3 days. The drainage pipes appear to be blocked. Residents have to wade through water to reach their homes.",
    category: "Drainage and Waterlogging",
    location: "Railway Colony Road, Near Gate 3",
    status: "Submitted",
    priority: "Urgent",
    reporterName: undefined,
    adminNotes: "",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Report submitted by user.",
      },
    ],
  },
  {
    title: "No water supply in Sector 9 for two days",
    description:
      "Residents of Sector 9 Blocks A, B, and C have had no piped water supply for the past two days. The water tanker that was sent yesterday was insufficient for the entire area. Several families are struggling to manage daily needs.",
    category: "Water Supply",
    location: "Sector 9, Blocks A, B, C",
    status: "In Progress",
    priority: "Urgent",
    reporterName: "Sunita Patel",
    adminNotes:
      "Water supply department contacted. Emergency tanker deployed. Pipeline repair in progress.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Report submitted by user.",
      },
      {
        status: "Under Review",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Water supply department contacted for urgent attention.",
      },
      {
        status: "In Progress",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Emergency tanker deployed. Pipeline repair in progress.",
      },
    ],
  },
  {
    title: "Damaged playground equipment in Children's Park",
    description:
      "The swing set in the Children's Park near Community Hall has broken chains on two swings. A young child was injured yesterday when one chain snapped. The slide also has a sharp metal edge. Immediate repair is needed to prevent further accidents.",
    category: "Public Property",
    location: "Children's Park, Near Community Hall, Sector 2",
    status: "Under Review",
    priority: "High",
    reporterName: "Meena Joshi",
    adminNotes: "Safety inspection scheduled.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Report submitted by user.",
      },
      {
        status: "Under Review",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Safety inspection scheduled.",
      },
    ],
  },
  {
    title: "Stray dog menace near Old Market",
    description:
      "A large pack of stray dogs near Old Market area has been aggressive towards pedestrians and shoppers. Three people have reported bites in the past week. This is an urgent public safety issue requiring immediate attention from animal control.",
    category: "Other",
    location: "Old Market Street, Sector 1",
    status: "Resolved",
    priority: "High",
    reporterName: "Vikram Singh",
    adminNotes:
      "Animal control team conducted an operation. Dogs vaccinated and relocated.",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Report submitted by user.",
      },
      {
        status: "Under Review",
        timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Animal control department notified.",
      },
      {
        status: "In Progress",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Animal control team dispatched.",
      },
      {
        status: "Resolved",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Animal control team conducted an operation. Dogs vaccinated and relocated.",
      },
    ],
  },
  {
    title: "Illegal dumping of construction debris on footpath",
    description:
      "A contractor has been dumping construction debris — broken bricks, sand, and cement bags — on the pedestrian footpath near Housing Society Gate 2. The footpath is completely blocked, forcing pedestrians to walk on the road.",
    category: "Waste Management",
    location: "Housing Society Gate 2, Sector 11",
    status: "Submitted",
    priority: "Medium",
    reporterName: undefined,
    adminNotes: "",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Report submitted by user.",
      },
    ],
  },
  {
    title: "Road surface cracked and broken near School",
    description:
      "The road surface near the primary school on Education Road has deteriorated badly. Multiple cracks and uneven sections make the road dangerous for cyclists and two-wheelers. School buses have difficulty navigating this stretch.",
    category: "Roads and Potholes",
    location: "Education Road, Near Primary School, Sector 5",
    status: "Resolved",
    priority: "Medium",
    reporterName: "Deepa Nair",
    adminNotes: "Road repaved by PWD. Work completed satisfactorily.",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Report submitted by user.",
      },
      {
        status: "Under Review",
        timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        note: "PWD notified and site inspection scheduled.",
      },
      {
        status: "In Progress",
        timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Road repair work underway.",
      },
      {
        status: "Resolved",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Road repaved by PWD. Work completed satisfactorily.",
      },
    ],
  },
  {
    title: "Drinking water supply contaminated near Riverside",
    description:
      "Residents near Riverside Colony have reported that tap water has a yellowish color and foul smell. Multiple residents have complained of stomach ailments after using the water. A water testing team should be deployed immediately.",
    category: "Water Supply",
    location: "Riverside Colony, Ward 3",
    status: "Under Review",
    priority: "Urgent",
    reporterName: "Ramesh Verma",
    adminNotes: "Water quality testing team dispatched.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Report submitted by user.",
      },
      {
        status: "Under Review",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        note: "Water quality testing team dispatched.",
      },
    ],
  },
];

export function getIdForSample(index: number): string {
  return `CC-DEMO${index.toString().padStart(4, "0")}`;
}
