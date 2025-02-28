"use client";

import React, { useEffect, useState } from "react";
import supabase from "../../../supabase";
import Bounded from "../components/Bounded";
import { BsStars } from "react-icons/bs";
import { Avatar, Button, Image, Spinner } from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { HeartIcon } from "../components/HeartIcon.jsx";

interface data {
  content_id: string;
  content_genre: string;
  content_name: string;
  content_img: string;
  content_likes: string[];
  content_owner_id: string;
  content_owner_name: string;
  content: object;
}

interface Item {
  type: string;
  text: string;
}

const page = () => {
  let params = new URLSearchParams(document.location.search);
  let content_id = params.get("id");
  const [data, setData] = useState<data[]>([]);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likedLoading, setLikedLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: contentData, error } = await supabase
          .from("all_content")
          .select("*")
          .eq("content_id", content_id);

        if (contentData) {
          setData(contentData[0]);
          return contentData[0];
        }
      } catch (error) {
        console.log(error);
      }
    };

    const checkLiked = (postData: any, userId: string) => {
      let likes_array = postData?.content_likes;

      if (!likes_array?.includes(userId)) {
        setLiked(false);
      } else {
        setLiked(true);
      }
    };

    const fetchDataAndCheckLiked = async () => {
      setLoading(true);

      const postData = await fetchData();
      const userId = await authState();

      if (userId) {
        checkLiked(postData, userId);
      }

      setLoading(false);
    };

    fetchDataAndCheckLiked();
  }, []);

  const handleLikePress = async () => {
    setLikedLoading(true);
    if (liked) {
      try {
        const userId = await authState();

        let likes_array = data?.content_likes;

        if (likes_array.includes(userId)) {
          likes_array = likes_array.filter((id) => id !== userId);
        }

        const { result } = await supabase
          .from("all_content")
          .update({ content_likes: likes_array })
          .eq("content_id", content_id)
          .select();

        setLiked(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLikedLoading(false);
      }
    } else {
      try {
        const userId = await authState();

        let likes_array = data?.content_likes;

        if (!likes_array.includes(userId)) {
          likes_array.push(userId);

          const { result } = await supabase
            .from("all_content")
            .update({ content_likes: likes_array })
            .eq("content_id", content_id)
            .select();

          setLiked(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLikedLoading(false);
      }
    }
  };

  const authState = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        return user.id;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Bounded as="article">
      {loading ? (
        <Spinner color="warning" />
      ) : (
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            flexDirection: "column",
          }}
          className="w-full"
        >
          <div className="flex flex-row items-center">
            <div>
              <BsStars color="#efff11" />
            </div>

            <p className="ml-1" style={{ fontSize: 12 }}>
              This Content is Not-By-Bot Verified
            </p>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 50,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            {data?.content_name}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 20,
              // fontWeight: "bold",
              marginTop: 5,
              color: "gray",
            }}
          >
            {data?.content?.subHeading}
          </div>

          <div className="mt-5 flex flex-row items-center justify-between">
            <div className="flex flex-row">
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
              <div className="ml-2">
                <p>{data?.content_owner_name}</p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FaEye />
                  <p className="ml-2">{data?.content?.readTime} read</p>
                </div>
              </div>
            </div>

            <div>
              {likedLoading ? (
                <Spinner color="warning" />
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <Button
                      color="danger"
                      variant="bordered"
                      onPress={handleLikePress}
                      startContent={
                        <HeartIcon
                          filled={liked}
                          size={undefined}
                          height={undefined}
                          width={undefined}
                          label={undefined}
                        />
                      }
                    >
                      {/* <p className="text-white">
                  {Array.isArray(data?.content_likes)
                    ? data?.content_likes.length
                    : 10}
                </p> */}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flex: 1,
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            <Image
              src="https://source.unsplash.com/random?wallpapers"
              alt="post pic"
              width={1200}
              height={500}
            />
          </div>

          {data?.content?.data?.map((item: Item) => {
            return (
              <div>
                {item.type === "Paragraph" ? (
                  <div style={{ fontSize: 17, marginTop: 20 }}>{item.text}</div>
                ) : (
                  <div
                    style={{ fontSize: 30, marginTop: 20, fontWeight: "bold" }}
                  >
                    {item.text}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Bounded>
  );
};

export default page;
