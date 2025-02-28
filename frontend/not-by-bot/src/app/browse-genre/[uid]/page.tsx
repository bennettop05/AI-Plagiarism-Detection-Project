import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrismicRichText, PrismicText, SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Bounded from "@/app/components/Bounded";
import supabase from "../../../../supabase";
import { Divider,Input } from "@nextui-org/react";
import SearchResults from "@/app/components/SearchResults";


type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID("marketplace", params.uid)
    .catch(() => notFound());

  const gen = page.data.genre;

  const genre_text=gen[0]?.text;

  return (
    <Bounded as="article">
      <div
        style={{
          alignSelf: "flex-start",
          display: "flex",
          flexDirection: "column",
        }}
        className="w-full"
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: "bold" }}>
          <PrismicText field={page.data.heading} />
        </div>

        <div className="mt-2 text-slate-300">
          <PrismicRichText field={page.data.subheading} />
        </div>

        {/* <Divider className="my-4 flex w-full bg-white " /> */}

        <div className="mt-6">
          
          <SearchResults data={genre_text}/>
        </div>
      </div>

      <SliceZone slices={page.data.slices} components={components} />
    </Bounded>
  );
}

export async function getServerSideProps({ params }: { params: Params }) {
  const client = createClient();
  let page;

  return {
    props: {
      page,
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const page = await client
    .getByUID("marketplace", params.uid)
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("marketplace");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
