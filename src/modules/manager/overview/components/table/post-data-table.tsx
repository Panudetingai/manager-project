import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDownIcon } from "lucide-react";
import { Database } from "../../../../../../utils/supabase/database.types";

type Post = {
  id: string;
  title: string;
  PostingTime: Date;
  status: "published" | "draft" | "scheduled";
  category:
    | "social"
    | "blog"
    | "news"
    | "update"
    | "other"
    | "promotion"
    | "announcement";
  postingPlatform: Database["public"]["Enums"]["social"];
  createdAt: string;
  updatedAt: string;
};

export const Posts: Post[] = [
  {
    id: "1",
    title: "Introducing Our New Product Line",
    PostingTime: new Date("2024-07-01T10:00:00Z"),
    status: "scheduled",
    category: "promotion",
    postingPlatform: "META",
    createdAt: "2024-06-20T12:00:00Z",
    updatedAt: "2024-06-22T15:30:00Z",
  },
  {
    id: "2",
    title: "Weekly Tech News Roundup",
    PostingTime: new Date("2024-06-28T14:00:00Z"),
    status: "published",
    category: "news",
    postingPlatform: "LINE",
    createdAt: "2024-06-15T09:00:00Z",
    updatedAt: "2024-06-28T14:30:00Z",
  },
  {
    id: "3",
    title: "How to Maximize Productivity with Our Tools",
    PostingTime: new Date("2024-07-03T08:00:00Z"),
    status: "draft",
    category: "blog",
    postingPlatform: "LINE",
    createdAt: "2024-06-25T11:00:00Z",
    updatedAt: "2024-06-26T10:15:00Z",
  },
  {
    id: "4",
    title: "Customer Success Story: Boosting Sales by 30%",
    PostingTime: new Date("2024-07-05T16:00:00Z"),
    status: "scheduled",
    category: "announcement",
    postingPlatform: "INSTAGRAM",
    createdAt: "2024-06-18T13:00:00Z",
    updatedAt: "2024-06-21T14:45:00Z",
  },
  {
    id: "5",
    title: "Monthly Update: New Features and Improvements",
    PostingTime: new Date("2024-06-30T09:00:00Z"),
    status: "published",
    category: "update",
    postingPlatform: "META",
    createdAt: "2024-06-10T10:00:00Z",
    updatedAt: "2024-06-30T09:30:00Z",
  },
  {
    id: "6",
    title: "Special Promotion: 20% Off All Services",
    PostingTime: new Date("2024-07-02T12:00:00Z"),
    status: "draft",
    category: "promotion",
    postingPlatform: "INSTAGRAM",
    createdAt: "2024-06-22T14:00:00Z",
    updatedAt: "2024-06-23T16:20:00Z",
  },
  {
    id: "7",
    title: "Expert Tips for Social Media Marketing",
    PostingTime: new Date("2024-07-04T11:00:00Z"),
    status: "scheduled",
    category: "blog",
    postingPlatform: "META",
    createdAt: "2024-06-19T15:00:00Z",
    updatedAt: "2024-06-20T12:30:00Z",
  },
];

export const ColumnsPosts: ColumnDef<Post>[] = [
  {
    accessorKey: "title",
    header: "Post Title",
    cell: ({ row }) => <span>{row.original.title}</span>,
  },
  {
    accessorKey: "PostingTime",
    header: "Posting Time",
    cell: ({ row }) => <span>{row.original.PostingTime.toLocaleDateString('th-TH')}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ChevronsUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge
        className={
          row.original.status === "published"
            ? "bg-green-500 text-white"
            : row.original.status === "scheduled"
            ? "bg-blue-500 text-white"
            : row.original.status === "draft"
            ? "bg-gray-500 text-white"
            : ""
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span>{row.original.category}</span>,
  },
  {
    accessorKey: "postingPlatform",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Platform
          <ChevronsUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant={"outline"}>
        {row.original.postingPlatform.toLowerCase()}
      </Badge>
    ),
  },
];
