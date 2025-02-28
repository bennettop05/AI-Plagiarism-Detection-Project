"use client";

import React, { useEffect, useState } from "react";
import Bounded from "../components/Bounded";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  Slider,
  Radio,
  RadioGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";
import supabase from "../../../supabase";

interface Item {
  type: string;
  text: string;
}

const page = () => {
  const [configStatus, setConfigStatus] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [readTime, setReadTime] = useState();
  const [genre, setGenre] = useState("");
  const [numPara, setNumPara] = useState();
  const [checkpointStatus, setCheckpointStatus] = useState(false);
  const [text, setText] = useState([]);
  const [type, setType] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [apiResult, setApiResult] = useState();
  const [apiLoader, setApiLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);

  useEffect(() => {
    onOpen();
  }, []);

  const handleTextChange = (input: string, index: number) => {
    const newText = [...text];
    newText[index] = input;
    setText(newText);
  };

  const handleTypeChange = (input: string, index: number) => {
    const newType = [...type];
    newType[index] = input;
    setType(newType);
  };

  const handleAddButton = () => {
    let content_text = [];

    for (let i = 0; i < text.length; i++) {
      content_text.push({ type: type[i], text: text[i] });
    }
    setContentData(content_text);
    setConfigStatus(true);
  };

  const checkAiPlag = async () => {
    setApiLoader(true);

    let combinedText = "";

    contentData.forEach((item: Item) => {
      combinedText += item.text + " ";
    });

    const text = combinedText;
    const baseUrl = "http://127.0.0.1:8000";
    const getMethod = "/predict/";

    try {
      const response = await axios.get(`${baseUrl}${getMethod}${text}`);

      if (response) {
        console.log(response.data.Result[0][0]);
        setApiResult(response.data.Result[0][0]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setApiLoader(false);
    }
  };

  const getUserName = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          let { data: users, error } = await supabase
            .from("users")
            .select("name")
            .eq("id", user.id);

          if (users) {
            return users[0].name;
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadData = async () => {
    try {
      setSubmitLoader(true);
      const user_name = await getUserName();

      const content_object = {
        title: title,
        subHeading: subHeading,
        readTime: readTime + " Min",
        data: contentData,
      };

      const { data, error } = await supabase
        .from("all_content")
        .insert([
          {
            content_genre: genre,
            content_name: title,
            content_img: "",
            content_owner_id: "",
            content_owner_name: user_name,
            content: content_object,
            content_likes: [],
          },
        ])
        .select();

      if (data) {
        let contentID = data[0]?.content_id;
        window.location.href = `http://localhost:3000/viewPost?id=${contentID}`;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitLoader(false);
    }
  };

  return (
    <Bounded as="article">
      <div>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
          backdrop="blur"
          size="4xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-black">
                  Configure your Upload
                </ModalHeader>
                <ModalBody>
                  {checkpointStatus ? (
                    <div className=" text-black">
                      {Array.from({ length: numPara || 0 }).map((_, index) => {
                        return (
                          <div
                            key={index}
                            className="mt-3 flex flex-row items-center text-black"
                          >
                            <Input
                              key="outside"
                              label="Enter your Text"
                              labelPlacement="outside"
                              value={text[index]}
                              onValueChange={(input) =>
                                handleTextChange(input, index)
                              }
                            />
                            <Dropdown style={{ color: "black" }}>
                              <DropdownTrigger>
                                <Button
                                  variant="bordered"
                                  style={{
                                    color: "black",
                                    marginLeft: 10,
                                    marginTop: 25,
                                  }}
                                >
                                  {type[index] ? type[index] : "Select Type"}
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="Action event example"
                                className="text-black"
                                onAction={(key) =>
                                  handleTypeChange(key + "", index)
                                }
                              >
                                <DropdownItem
                                  key="Header"
                                  className="text-black"
                                >
                                  Header
                                </DropdownItem>
                                <DropdownItem
                                  key="Paragraph"
                                  className="text-black"
                                >
                                  Paragraph
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      <Input
                        autoFocus
                        label="Title"
                        variant="bordered"
                        style={{ color: "black" }}
                        value={title}
                        onValueChange={setTitle}
                      />
                      <Input
                        label="Sub-heading"
                        variant="bordered"
                        style={{ color: "black" }}
                        value={subHeading}
                        onValueChange={setSubHeading}
                      />
                      <p
                        style={{
                          marginTop: 5,
                          marginBottom: 5,
                          color: "black",
                          fontSize: 18,
                        }}
                      >
                        Reading time for your Content
                      </p>

                      <Slider
                        size="sm"
                        step={1}
                        maxValue={15}
                        minValue={0}
                        aria-label="Temperature"
                        defaultValue={6}
                        className="max-w-md"
                        color="warning"
                        showTooltip={true}
                        onChangeEnd={setReadTime}
                      />
                      <p className="text-small font-medium text-default-500">
                        Current reading time: {readTime}
                      </p>

                      {readTime ? (
                        <p
                          style={{
                            marginTop: 5,
                            marginBottom: 5,
                            color: "black",
                            fontSize: 18,
                          }}
                        >
                          Select your Genre
                        </p>
                      ) : (
                        <></>
                      )}

                      <RadioGroup
                        value={genre}
                        onValueChange={setGenre}
                        orientation="horizontal"
                        color="warning"
                      >
                        <Radio value="research">Research</Radio>
                        <Radio value="literature">Literature</Radio>
                        <Radio value="technical">Technical</Radio>
                        <Radio value="history">History</Radio>
                        <Radio value="sports">Sports</Radio>
                      </RadioGroup>

                      {genre ? (
                        <p className="text-small text-default-500">
                          Selected: {genre}
                        </p>
                      ) : null}

                      <div className="mt-6 flex flex-row">
                        <Input
                          key="outside-left"
                          label="Number of Paragraphs"
                          labelPlacement="outside-left"
                          type="number"
                          onValueChange={setNumPara}
                          value={numPara}
                          // description="outside-left"
                        />
                      </div>
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  {checkpointStatus ? (
                    <>
                      <Button
                        color="primary"
                        onPress={() => setCheckpointStatus(false)}
                      >
                        Back
                      </Button>

                      {configStatus ? (
                        <>
                          <Button color="primary" onPress={onClose}>
                            See Preview
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button color="primary" onPress={handleAddButton}>
                            Add Data
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <Button
                      color="primary"
                      onPress={() => setCheckpointStatus(true)}
                    >
                      Next
                    </Button>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      {configStatus ? (
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            flexDirection: "column",
          }}
          className="w-full"
        >
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <div
                style={{
                  display: "flex",
                  fontSize: 50,
                  fontWeight: "bold",
                  marginTop: 10,
                }}
              >
                {title}
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
                {subHeading}
              </div>
            </div>

            {apiLoader ? (
              <Spinner color="warning" />
            ) : (
              <>
                {apiResult ? (
                  <div className=" flex flex-col">
                    {apiResult > 0.7 ? (
                      <>
                        <p className="text-green-500">
                          Your Content has passed our checks
                        </p>

                        {submitLoader ? (
                          <Spinner color="warning" />
                        ) : (
                          <Button
                            variant="light"
                            color="warning"
                            onPress={() => uploadData()}
                          >
                            Upload Data
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-red-500">
                          Your Content did not pass our checks
                        </p>
                        <Button
                          variant="ghost"
                          color="warning"
                          onPress={() => checkAiPlag()}
                        >
                          Check AI Plagarism
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      color="warning"
                      onPress={() => checkAiPlag()}
                    >
                      Check AI Plagarism
                    </Button>
                  </>
                )}
              </>
            )}
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

          {contentData.map((item: Item) => {
            return (
              <div>
                {item.type === "Paragraph" ? (
                  <div style={{ fontSize: 17, marginTop: 20 }}>
                    {item.text} Title
                  </div>
                ) : (
                  <div
                    style={{ fontSize: 30, marginTop: 20, fontWeight: "bold" }}
                  >
                    {item.text} subHeaing
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-balance text-center text-5xl font-medium md:text-7xl">
            Upload your Content
          </h2>
          <p className="mt-5 bg-gradient-to-b from-yellow-100 to-yellow-500 bg-clip-text not-italic text-transparent">
            Get Started on your journey with us. Click on the Button below to
            start configuring your first upload
          </p>
          <Button
            variant="ghost"
            color="warning"
            style={{ marginTop: 20 }}
            onPress={onOpen}
          >
            Configure Upload
          </Button>
        </div>
      )}
    </Bounded>
  );
};

export default page;
