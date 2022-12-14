import { GetStaticProps, NextPage } from "next";
import React, { FunctionComponent, useState } from "react";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post as PostType } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

type Props = {
  post: PostType;
};

export const Post: NextPage<Props> = ({ post }) => {
  // console.log(post);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        console.log("submiteteteted");
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Header />

      <img
        className="w-full h-60 object-cover"
        src={urlFor(post.mainImage).url()}
        alt=""
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            className="h-12 w-12 rounded-full"
            src={urlFor(post.author.image).url()}
            alt=""
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props}></h1>
              ),
              h2: (props: any) => (
                <h1 className="text-xl font-bold my-5" {...props}></h1>
              ),
              h3: (props: any) => (
                <h1 className="text-lg font-bold my-5" {...props}></h1>
              ),
              h4: (props: any) => (
                <h1 className="text-base font-bold my-5" {...props}></h1>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
              p: ({ children }: any) => {
                return <p className="pt-10">{children}</p>;
              },
              normal: ({ children }: any) => {
                return <p className="pt-4">{children}</p>;
              },
              blockquote: ({ children }: any) => {
                console.log("sou um blockquote");
                return <p className="pt-10">{children}</p>;
              },
            }}
          />
        </div>
      </article>

      {/* Comments */}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}: </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>

      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          {/* <p>Once it has been approved, it will appear below!</p> */}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2"></hr>

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-grey-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-200 outline-none focus:ring"
              placeholder="John Appleseed"
              type={"text"}
            />
          </label>
          <label className="block mb-5">
            <span className="text-grey-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-200 outline-none focus:ring"
              placeholder="John Appleseed"
              type={"email"}
            />
          </label>
          <label className="block mb-5">
            <span className="text-grey-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-200 outline-none focus:ring"
              placeholder="John Appleseed"
              rows={8}
            />
          </label>

          {/* errors will return when field validation fails */}
          <div className="flex flex-col p-5">
            {errors.name && <p className="text-red-500">- Name is required</p>}
            {errors.comment && (
              <p className="text-red-500">- Comment is required</p>
            )}
            {errors.email && (
              <p className="text-red-500">- Email is required</p>
            )}
          </div>

          <input
            type="submit"
            className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer "
          />
        </form>
      )}
    </main>
  );
};

export default Post;

//which routes should next.js pre-built at first? (ISR talks)
export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug {
     current
    },
   }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: PostType) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,  
        title,
        author -> {
          name, 
          image
        },
        'comments': *[
          _type == 'comment' &&
          post._ref == ^._id 
        ],
        description,
        mainImage,
        slug,
        body
       }`;

  const post = await sanityClient.fetch(query, { slug: params?.slug });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // after 60 seconds, it will update the old cache version
  };
};

// const subscribers: any[] = [];

// const bus = (request: any) => {
//   const token = request.header.token;
//   for (const s of subscribers) {
//     if (s.token === token) {
//       s.dispatch(request);
//     }
//   }
// };

// const getBus = () => {
//   return Hardware.bus();
// };

// const reactApp = () => {
//   const bus = getBus();
//   bus.subscribe(dispatch);
// };
