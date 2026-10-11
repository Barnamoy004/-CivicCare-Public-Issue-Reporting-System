import { IssueCategory } from "@/lib/types";
import {
  Construction,
  Trash2,
  Lightbulb,
  Droplets,
  Waves,
  Building2,
  HelpCircle,
} from "lucide-react";

const categoryIcons: Record<IssueCategory, React.ReactNode> = {
  "Roads and Potholes": <Construction size={16} />,
  "Waste Management": <Trash2 size={16} />,
  Streetlights: <Lightbulb size={16} />,
  "Drainage and Waterlogging": <Waves size={16} />,
  "Water Supply": <Droplets size={16} />,
  "Public Property": <Building2 size={16} />,
  Other: <HelpCircle size={16} />,
};

export default function CategoryIcon({ category }: { category: IssueCategory }) {
  return (
    <span className="inline-flex items-center text-emerald-700">
      {categoryIcons[category] ?? <HelpCircle size={16} />}
    </span>
  );
}
