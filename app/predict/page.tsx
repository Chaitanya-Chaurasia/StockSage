"use client";
import { useState } from "react";
import { Search, Home, Activity, ArrowUp, Users } from "lucide-react";
import { Github } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import apple from "@/public/apple.svg";
import finn from "@/public/finn.png";
import google from "@/public/google.png";
import meta from "@/public/meta.svg";
import nvidia from "@/public/nvidia.svg";
import amazon from "@/public/amazon.svg";
import reddit from "@/public/reddit.svg";
import yh from "@/public/yh.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [latestNews, setLatestNews] = useState([
    {
      id: 1,
      headline: "Tesla Announces New EV Model",
      datetime: "2024-11-19",
      summary:
        "Tesla unveils its latest electric vehicle, promising unprecedented range and performance.",
    },
    {
      id: 2,
      headline: "Apple's Q4 Earnings Exceed Expectations",
      datetime: "2024-11-18",
      summary:
        "Apple reports strong Q4 earnings, surpassing analyst predictions with record-breaking iPhone sales.",
    },
    {
      id: 3,
      headline: "Amazon Expands into Healthcare Sector",
      datetime: "2024-11-17",
      summary:
        "Amazon makes a bold move into healthcare with the acquisition of a major pharmacy chain.",
    },
    {
      id: 4,
      headline: "Microsoft Launches New AI Tool",
      datetime: "2024-11-16",
      summary:
        "Microsoft introduces a new AI tool designed to improve productivity and streamline workflows.",
    },
  ]);
  const [popularStocks, setPopularStocks] = useState([
    { name: "AAPL", price: 150.25, change: 2.5, image: apple },
    { name: "GOOGL", price: 2750.1, change: -0.8, image: google },
    { name: "META", price: 3500.75, change: 1.2, image: meta },
    { name: "NVD", price: 3500.75, change: 1.2, image: nvidia },
    { name: "AMZN", price: 3500.75, change: 1.2, image: amazon },
  ]);
  const [topPerformingStocks, setTopPerformingStocks] = useState([
    { name: "AAPL", price: 150.25, change: 2.5, image: apple },
    { name: "GOOGL", price: 2750.1, change: -0.8, image: google },
    { name: "META", price: 3500.75, change: 1.2, image: meta },
    { name: "NVD", price: 3500.75, change: 1.2, image: nvidia },
    { name: "AMZN", price: 3500.75, change: 1.2, image: amazon },
  ]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center">
      <div className="flex w-full gap-2 items-center justify-center">
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-4 tracking-tighter flex gap-2">
              <ArrowUp />
              top performing stocks
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            {popularStocks.map((s) => {
              return (
                <Card
                  key={s.name}
                  className="flex flex-col items-center justify-center text-center gap-2 p-4"
                >
                  <Image src={s.image} alt={s.name} className=" " height={15} />
                  <div>
                    <CardTitle className="text-lg">{s.name}</CardTitle>
                    <CardTitle className="text-xs antext-muted-foreground font-normal">
                      {s.price} ({s.change}%)
                    </CardTitle>
                  </div>
                </Card>
              );
            })}
          </CardContent>
        </Card>
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-4 tracking-tighter flex gap-2">
              <Users />
              popular stocks
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            {popularStocks.map((s) => {
              return (
                <Card
                  key={s.name}
                  className="flex flex-col items-center justify-center text-center gap-2 p-4"
                >
                  <Image src={s.image} alt={s.name} className=" " height={15} />
                  <div>
                    <CardTitle className="text-lg">{s.name}</CardTitle>
                    <CardTitle className="text-xs antext-muted-foreground font-normal">
                      {s.price} ({s.change}%)
                    </CardTitle>
                  </div>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <div className="p-10 flex flex-col gap-4">
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4 tracking-tighter flex gap-2">
            <Activity />
            news on the go!
          </h2>
          <div className="flex gap-2">
            {latestNews.map((news) => (
              <Card key={news.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{news.headline}</CardTitle>
                  <CardTitle className="text-sm text-muted-foreground font-normal">
                    {news.datetime}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{news.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
