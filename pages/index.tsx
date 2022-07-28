import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

type Props = {
  posts: Post[];
};

const Home: NextPage<Props> = ({ posts }) => {
  console.log(posts);
  return (
    <div className=" max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-5">
        <div className="px-10 space-y-5">
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-black decoration-4">
              Medium
            </span>{" "}
            is a place to write, read, and connect
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and connect
            with millions of readers.
          </h2>
        </div>
        <img
          className="hidden md:inline-flex h-32 lg:h-50 mr-10"
          src="https://cdn.worldvectorlogo.com/logos/medium-1.svg"
          alt=""
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md-gap-6 p-2 md:p-6">
        {posts
          .sort((p1, p2) => (p1.title > p2.title ? 1 : -1))
          .map((post) => {
            console.log(post.title);
            return (
              <Link key={post._id} href={`/post/${post.slug.current}`}>
                <div className="border rounded-lg group cursor-pointer hover:scale-105">
                  <img
                    className="h-60 w-full object-cover  transition-transform duration-200 ease-in-out"
                    src={urlFor(post.mainImage).url()}
                    alt=""
                  />
                  <div className="flex justify-between p-5 bg-white ">
                    <div>
                      <p className="text-lg font-bold">{post.title}</p>
                      <p className="text-xs">
                        {post.description} by{" "}
                        <span className="font-bold">{post.author.name}</span>
                      </p>
                      <img
                        className="h-12 w-12 rounded-full"
                        src={urlFor(post.author.image).url()}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

const Grid: any = "";

const a = () => {
  <Grid container spacing={2}>
    {[" ", " ", " ", " "].map((lala) => (
      <Grid item key={lala} xs={12} md={6} lg={4}></Grid>
    ))}
  </Grid>;
};

export default Home;

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    author -> {
      name,
      image
    },
    description,  
    mainImage,
    slug,
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
