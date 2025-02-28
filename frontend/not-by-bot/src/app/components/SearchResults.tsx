"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Image,
  Spinner,
} from "@nextui-org/react";
import supabase from "../../../supabase";
import { FaEye, FaRegHeart } from "react-icons/fa";
import Link from "next/link";

type SearchResultsProps = {
  data: string;
};

interface Item {
  content_id: string;
  content_genre: string;
  content_name: string;
  content_img: string;
  content_likes: string[];
  content_owner_id: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ data }) => {
  const [like, setLiked] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [fetchedData, setFetchedData] = useState<Item[]>([]);
  const [mappingData, setMappingData] = useState<Item[]>([]);
  const [filter, setFilter] = useState("title");
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: all_content, error } = await supabase
          .from("all_content")
          .select("*")
          .eq("content_genre", data);

        if (all_content) {
          setFetchedData(all_content);
          setMappingData(all_content);
          setTotalResults(all_content.length);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    console.log(searchText);
    console.log(filter);
    setLoading(true);

    let data: Item[] = [];
    if (filter === "title") {
      fetchedData.map((item) => {
        if (
          item?.content_name.toLowerCase().includes(searchText.toLowerCase())
        ) {
          data.push(item);
        }
      });
      setMappingData(data);
      setLoading(false);
    }

    if (filter === "author") {
      fetchedData.map((item) => {
        if (
          item?.content_owner_name
            .toLowerCase()
            .includes(searchText.toLowerCase())
        ) {
          data.push(item);
        }
      });
      setMappingData(data);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="mt-4 flex items-center">
        <Input
          color="default"
          type="text"
          variant="bordered"
          label="Search"
          className="text-white"
          onValueChange={setSearchText}
        />

        <div className="ml-2">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" color="warning" size="lg">
                Filter
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              onAction={(key) => setFilter(key + "")}
            >
              <DropdownItem key="title" className="text-black">
                Search By Title
              </DropdownItem>
              <DropdownItem key="author" className="text-black">
                Search By Author
              </DropdownItem>
              {/* <DropdownItem key="likes" className="text-black">
                Sort By Likes
              </DropdownItem> */}
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="ml-2">
          <Button
            variant="ghost"
            color="warning"
            size="lg"
            onPress={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
        <FaEye color="#edbc1b" />
        <p className="ml-2">Searching by {filter}</p>
      </div>

      <p style={{ fontSize: 25, fontFamily: "cursive", marginTop: 50 }}>
        Found {mappingData.length} Results
      </p>

      {loading ? (
        <Spinner color="warning" />
      ) : (
        <div
          style={{
            alignSelf: "flex-start",
            display: "flex",
            //   flex:1,
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          {mappingData.map((item) => {
            return (
              <Link href={`/viewPost?id=${item?.content_id}`}>
              <div
                key={item?.content_id}
                style={{ flex: "0 0 auto", margin: 8 }}
              >
                <div className="mb-2 rounded-md">
                  <div>
                    <Image
                      alt="Card background"
                      className="rounded-xl object-cover"
                      src="https://source.unsplash.com/random?wallpapers"
                      width={265}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="mx-2 flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">
                      {item?.content_name}
                    </h4>
                    <small className="flex items-center ">
                      <FaRegHeart className="mr-1" />
                      <p className="text-white">{Array.isArray(item.content_likes) ? item.content_likes.length : 10}</p>
                    </small>
                  </div>

                  <p className="ml-2 text-tiny font-bold uppercase text-default-500">
                    {item?.content_genre}
                  </p>
                </div>
              </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
