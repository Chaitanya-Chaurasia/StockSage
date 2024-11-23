"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "@/app/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2, SquareRadical, Sticker, Store } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import yh from "@/public/yh.png";
import reddit from "@/public/reddit.svg";
import fin from "@/public/finn.png";
import Image from "next/image";
const StockDashboard: React.FC = () => {
  const params = useSearchParams();
  const companyFromParams = params.get("name");
  const [stockData, setStockData] = useState<any[]>([]);
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [averageSentiment, setAverageSentiment] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentStockPage, setCurrentStockPage] = useState(1);
  const stocksPerPage = 5;
  const [lowerThreshold, setLowerThreshold] = useState(-10);
  const [upperThreshold, setUpperThreshold] = useState(10);
  const [decision, setDecision] = useState("Click on  Calculate Decisions.");
  const [finnhubDecision, setFinnhubDecision] = useState(
    "Click on  Calculate Decisions."
  );
  const [modelPred, setModelPred] = useState("Click on  Calculate Decisions.");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setDecision("Click on  Calculate Decisions.");
        setModelPred("Click on  Calculate Decisions.");

        await fetchStockPrices();
        await collectRedditPosts();
        await fetchSentimentScores();
        await collectFinnHubSentiment();
        setNotification(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotification("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyFromParams]);

  const totalStockPages = Math.ceil(stockData.length / stocksPerPage);
  const stockStartIndex = (currentStockPage - 1) * stocksPerPage;
  const currentStockData = stockData.slice(
    stockStartIndex,
    stockStartIndex + stocksPerPage
  );

  // Handle content truncation
  const truncateContent = (content: any) =>
    content.length > 200
      ? `${content.substring(0, 200)}... (read more)  `
      : content;

  const fetchStockPrices = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/stock_prices`, {
        company: companyFromParams,
      });
      setStockData(response.data.daily_prices);
    } catch (error) {
      console.error("Error fetching stock prices:", error);
      throw error;
    }
  };

  const collectFinnHubSentiment = async () => {};
  const calculateTradeDecision = async () => {
    try {
      const data = {
        threshold_high: upperThreshold,
        threshold_low: lowerThreshold,
        sentiment_scores: sentimentData.map((item) => item.score),
        closing_prices: stockData.map((item) => item.close),
      };

      const response = await axios.post(
        "http://localhost:5000/trade_decisions",
        data
      );
      setDecision(response.data.action);
      setModelPred(response.data.model_prediction);
      setNotification(`Trade Decision: ${response.data.action.toUpperCase()}`);
    } catch (error) {
      console.error("Error calculating trade decision:", error);
      setNotification("Error calculating trade decision. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSentimentScores = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/daily_sentiment_scores`
      );
      setSentimentData(response.data.daily_sentiment_scores);
      setAverageSentiment(response.data.average_sentiment);
    } catch (error) {
      console.error("Error fetching sentiment scores:", error);
      throw error;
    }
  };

  const collectRedditPosts = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/collect_reddit_posts`,
        {
          company: companyFromParams,
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error collecting Reddit posts:", error);
      throw error;
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4 tracking-tighter">
        Your results for {companyFromParams}
      </h1>
      <hr />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-gray-500" size={48} />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tighter flex flex-col">
              Stock Prices{" "}
              <span className="flex text-sm font-normal w-full items-center justify-start gap-2">
                powered by <Image src={yh} className="h-4 w-10" alt="image" />
              </span>
            </h2>

            {stockData.length > 0 && (
              <>
                <div className="h-[280px]">
                  <ResponsiveContainer
                    className="mt-10"
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={stockData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="open"
                        stroke="#8884d8"
                        name="Open Price"
                      />
                      <Line
                        type="monotone"
                        dataKey="close"
                        stroke="#82ca9d"
                        name="Close Price"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-col gap-4 items-center justify-center">
                  <Table>
                    <TableCaption>
                      Daily opening and Closing Prices for {companyFromParams}{" "}
                      (in USD)
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableCell className="font-semibold text-center">
                          Date
                        </TableCell>
                        <TableCell className="font-semibold text-center">
                          Open Price
                        </TableCell>
                        <TableCell className="font-semibold text-center">
                          Close Price
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentStockData.map((day, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center">
                            {day.date}
                          </TableCell>
                          <TableCell className="text-center">
                            {day.open}
                          </TableCell>
                          <TableCell className="text-center">
                            {day.close}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentStockPage((prev) =>
                                Math.max(prev - 1, 1)
                              )
                            }
                            // disabled={currentStockPage === 1}
                          />
                        </PaginationItem>
                        {[...Array(totalStockPages)].map((_, index) => (
                          <PaginationItem key={index}>
                            <PaginationLink
                              onClick={() => setCurrentStockPage(index + 1)}
                              isActive={currentStockPage === index + 1}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentStockPage((prev) =>
                                Math.min(prev + 1, totalStockPages)
                              )
                            }
                            // disabled={currentStockPage === totalStockPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              </>
            )}
          </div>
          <hr />
          <div className="mt-6">
            <h2 className="text-xl font-semibold tracking-tighter flex flex-col">
              Trending Posts on {companyFromParams}
              <span className="flex text-sm font-normal w-full items-center justify-start">
                powered by{" "}
                <Image src={reddit} className="h-10 w-20" alt="image" />
              </span>
            </h2>
            {posts.length > 0 ? (
              <>
                <Table>
                  <TableCaption>
                    Reddit posts related to {companyFromParams}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableCell className="font-semibold">Title</TableCell>
                      <TableCell className="font-semibold">Content</TableCell>
                      <TableCell className="font-semibold text-right">
                        Sentiment Score
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPosts.map((post, index) => (
                      <TableRow key={index}>
                        <TableCell className=" text-wrap w-[33%]">
                          {post[0]}
                        </TableCell>
                        <TableCell className="text-wrap">
                          {truncateContent(post[1] ? post[1] : "N/A")}
                        </TableCell>
                        <TableCell
                          className={`text-right w-[10%] ${
                            post[2] > 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {post[2]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                        />
                      </PaginationItem>

                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No posts available.</p>
            )}
          </div>
          <hr />

          <div className="space-y-2">
            <h2 className="text-xl flex flex-col font-semibold tracking-tighter">
              Sentiment Scores based on Collected Posts
              <span className="flex text-sm font-normal w-full items-center justify-start">
                powered by
                <Image src={fin} className="h-10 w-20" alt="image" />
              </span>
            </h2>

            <div className="mt-2">
              <p
                className={`text-3xl tracking-tighter ${
                  averageSentiment > 60
                    ? "text-green-500"
                    : averageSentiment < 30
                    ? "text-red-500"
                    : "text-black"
                }`}
              >
                Average Sentiment: {averageSentiment.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <span className="mt-4">
                Customize your trade decision. Input custom threshold values and
                get an approximate decision on whether to trigger buy or sell{" "}
                {companyFromParams}.
              </span>
              <div className="flex items-center space-x-2 mt-4">
                <Button
                  onClick={() => setLowerThreshold((prev) => prev - 1)}
                  className="px-3 py-1"
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={lowerThreshold}
                  onChange={(e) => setLowerThreshold(Number(e.target.value))}
                  className="w-20 text-center"
                />
                <Button
                  onClick={() => setLowerThreshold((prev) => prev + 1)}
                  className="px-3 py-1"
                >
                  +
                </Button>
                <span>to</span>
                <Button
                  onClick={() => setUpperThreshold((prev) => prev - 1)}
                  className="px-3 py-1"
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={upperThreshold}
                  onChange={(e) => setUpperThreshold(Number(e.target.value))}
                  className="w-20 text-center"
                />
                <Button
                  onClick={() => setUpperThreshold((prev) => prev + 1)}
                  className="px-3 py-1"
                >
                  +
                </Button>
                <Button onClick={calculateTradeDecision} disabled={loading}>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Calculate Decision"
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-top justify-center gap-2 w-full">
              <p className="flex gap-2 font-normal tracking-tighter text-md mt-8">
                <Sticker />
                Action according to Sentiment Analysis:{" "}
                <span className="font-semibold">{decision}</span>
              </p>
              <p className="font-normal gap-2 flex text-wrap tracking-tighter text-md">
                <SquareRadical />
                Based on closing prices, model predicts you should:{" "}
                <span className="font-semibold">{modelPred}</span>
              </p>
              <p className="font-normal flex gap-2 tracking-tighter text-md">
                <Store />
                What Market says:
                <span className="font-semibold">
                  {" "}
                  {finnhubDecision || "N/A"}
                </span>
              </p>
            </div>
            {sentimentData.length > 0 && (
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell className="font-semibold text-center">
                        Date
                      </TableCell>
                      <TableCell className="font-semibold text-center">
                        Daily Sentiment Score
                      </TableCell>
                      <TableCell className="font-semibold text-center">
                        Behaviour
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sentimentData.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center">
                          {day.date}
                        </TableCell>
                        <TableCell
                          className={`text-center ${
                            day.score > 0
                              ? "text-green-500"
                              : day.score < 0
                              ? "text-red-500"
                              : "text-black"
                          }`}
                        >
                          {day.score.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={`text-center ${
                            day.sentiment > 0
                              ? "text-green-500"
                              : day.sentiment < 0
                              ? "text-red-500"
                              : "text-black"
                          }`}
                        >
                          {day.sentiment}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StockDashboard;
