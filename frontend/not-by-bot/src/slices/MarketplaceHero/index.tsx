"use client";

import Bounded from "@/app/components/Bounded";
import { createClient } from "@/prismicio";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import {
  Spinner,
  Card,
  CardBody,
  Image,
  Button,
  CardHeader,
  Avatar,
  AvatarGroup,
  Link,
} from "@nextui-org/react";
import supabase from "../../../supabase";
import { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";

export type MarketplaceHeroProps =
  SliceComponentProps<Content.MarketplaceHeroSlice>;

interface Item {
  content_id: string;
  content_genre: string;
  content_name: string;
  content_img: string;
  content_likes: string[];
  content_owner_id: string;
}

const MarketplaceHero = async ({
  slice,
}: MarketplaceHeroProps): Promise<JSX.Element> => {
  const client = createClient();
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<Content.MarketplaceDocument[]>([]);
  const [data, setData] = useState<Item[]>([]);
  const [likes, setLikes] =useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      const genresData = await Promise.all(
        slice.items.map(async (item) => {
          if (isFilled.contentRelationship(item.genre)) {
            return await client.getByID<Content.MarketplaceDocument>(
              item.genre.id,
            );
          }
        }),
      );
      setGenres(
        genresData.filter(
          (genre) => genre !== undefined,
        ) as Content.MarketplaceDocument[],
      );
      setLoading(false);
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        let { data: all_content, error } = await supabase
          .from("all_content")
          .select("*");

        if (all_content) {
          setData(all_content);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchGenres();

    fetchData();
  }, []);

  return (
    <div>
      <Bounded
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="text-center"
      >
        <PrismicRichText
          field={slice.primary.heading}
          components={{
            heading2: ({ children }) => (
              <h2 className="text-balance text-center text-5xl font-medium md:text-7xl">
                {children}
              </h2>
            ),
            em: ({ children }) => (
              <em className="bg-gradient-to-b from-yellow-100 to-yellow-500 bg-clip-text not-italic text-transparent">
                {children}
              </em>
            ),
          }}
        />

        <div className="mt-6 text-slate-300">
          <PrismicRichText field={slice.primary.body} />
        </div>
      </Bounded>

      <div className="mx-auto flex max-w-6xl flex-col justify-between py-2 font-medium text-white md:items-center">
        <div className="flex">
          <div>
            <div
              style={{ alignSelf: "flex-start", maxWidth: 300, marginLeft: 20 }}
            >
              Get your content authenticated with us today and unlock
              opportunities with potential employers!
            </div>

            <div
              style={{
                alignSelf: "flex-start",
                maxWidth: 300,
                marginLeft: 10,
                marginTop: 100,
              }}
            >
              <AvatarGroup
                // isBordered
                max={3}
                total={5300}
                renderCount={(count) => (
                  <p className="ms-2 text-small font-medium text-white">
                    +{count} have joined us !
                  </p>
                )}
              >
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
              </AvatarGroup>
            </div>
          </div>

          <div>
            <div className="mb-10 rounded-l-full rounded-r-full bg-gradient-to-b from-yellow-500 to-yellow-200 p-10 px-32">
              <Image src="/assets/bg4.png" width={200} height={200} />
            </div>
          </div>

          <div className="mt-20">
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: 300,
                marginLeft: 20,
                flexDirection: "row",
                display: "flex",
              }}
            >
              <div
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    fontFamily: "cursive",
                    fontWeight: "bold",
                  }}
                >
                  5K+
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontFamily: "cursive",
                    fontWeight: "bold",
                  }}
                >
                  Creators
                </div>
              </div>
              <div
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  marginLeft: 30,
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    fontFamily: "cursive",
                    fontWeight: "bold",
                  }}
                >
                  1K+
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontFamily: "cursive",
                    fontWeight: "bold",
                  }}
                >
                  Verified Content
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <Spinner color="warning" />
        ) : (
          <>
            <div
              className="grid max-w-7xl grid-rows-[auto_auto_auto] items-center justify-center gap-8 self-center md:grid-cols-6 md:gap-10"
              style={{ marginTop: 25 }}
            >
              {genres.map(
                (genre, index) =>
                  genre && (
                    <div key={genre.id}>
                      <PrismicNextLink document={genre}>
                        <div className="flex items-center justify-center rounded-xl border border-blue-50/20 bg-gradient-to-b from-slate-50/15 to-slate-50/5 p-7 px-9 backdrop-blur-sm hover:scale-110 hover:text-yellow-300">
                          <PrismicRichText field={genre.data.heading} />
                        </div>
                      </PrismicNextLink>
                    </div>
                  ),
              )}
            </div>
            <div
              style={{
                alignSelf: "flex-start",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <h3 style={{ fontSize: 25, width: "100%", marginBottom: 30 }}>
                Unlock a world of captivating stories handpicked just for you!
              </h3>
              {data.map((item: Item) => {
                return (
                  <Link href={`/viewPost?id=${item?.content_id}`}>
                  <div
                    key={item.content_id}
                    style={{ flex: "0 0 auto", margin: 8 }}
                  >
                    <div className="rounded-md mb-2">
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
                        <h4 className="font-bold text-white text-lg">
                          {item.content_name}
                        </h4>
                        <small className="flex items-center ">
                          <FaRegHeart className="mr-1" color="white " />
                          <p className="text-white">{Array.isArray(item.content_likes) ? item.content_likes.length : 10}</p>
                        </small>
                      </div>

                      <p className="text-tiny font-bold uppercase text-default-500 ml-2">
                        {item.content_genre}
                      </p>
                    </div>
                  </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketplaceHero;
