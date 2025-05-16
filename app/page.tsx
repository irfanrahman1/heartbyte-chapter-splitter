"use client";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { splitChaptersFromText, Chapter } from "@/utils/splitChapters";
import { useRef } from "react";


import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  ScrollShadow,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { cn } from "@nextui-org/theme"; 
import React from "react";

import { title } from "@/components/primitives";

export default function Home() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
const [selectedChapterIdx, setSelectedChapterIdx] = useState(0);

function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    const parsed = splitChaptersFromText(text);
    setChapters(parsed);
    setSelectedChapterIdx(0);
  };
  reader.readAsText(file);
}
const textareaRef = useRef<HTMLTextAreaElement>(null);

function handleInsertSplitMarker() {
  if (!textareaRef.current) return;

  const textarea = textareaRef.current;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const original = chapters[selectedChapterIdx]?.content ?? "";

  const updated =
    original.substring(0, start) +
    "\n====SPLIT CHAPTER====\n" +
    original.substring(end);

  const updatedChapters = [...chapters];
  updatedChapters[selectedChapterIdx] = {
    ...updatedChapters[selectedChapterIdx],
    content: updated,
  };
  setChapters(updatedChapters);
}

function handleSplitChapter() {
  const current = chapters[selectedChapterIdx];
  if (!current) return;

  const parts = current.content
    .split("====SPLIT CHAPTER====")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length <= 1) return;

  const newChapters = [
    ...chapters.slice(0, selectedChapterIdx),
    ...parts.map((p, i) => ({
      title: `${current.title} (${i + 1})`,
      content: p,
    })),
    ...chapters.slice(selectedChapterIdx + 1),
  ];

  setChapters(newChapters);
  setSelectedChapterIdx(selectedChapterIdx); // stay on the new first split
}

function handleMergeWithNext() {
  if (selectedChapterIdx < 0 || selectedChapterIdx >= chapters.length - 1) return;

  const current = chapters[selectedChapterIdx];
  const next = chapters[selectedChapterIdx + 1];

  const mergedChapter: Chapter = {
    title: current.title, // keep current title
    content: current.content + "\n\n" + next.content,
  };

  const updatedChapters = [
    ...chapters.slice(0, selectedChapterIdx),
    mergedChapter,
    ...chapters.slice(selectedChapterIdx + 2),
  ];

  setChapters(updatedChapters);
}


  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Upload a .txt file to begin</span>
<div className="mt-2">
  <input
    type="file"
    accept=".txt"
    onChange={handleFileUpload}
    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
      file:rounded-full file:border-0 file:text-sm file:font-semibold 
      file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
  />
</div>

      </div>
      <div className="mt-8 gap-16">
        <Snippet hideCopyButton hideSymbol className="gap-4" variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
          <span>Please feel free to use the example components below.</span>
        </Snippet>
      </div>
      <div className="pt-6 w-48">
        <Select
          items={[
            { key: "story-1", label: "story-1" },
            { key: "story-2", label: "story-2" },
            { key: "story-3", label: "story-3" },
          ]}
          label="Story"
          placeholder="Select a story"
        >
          {(story) => <SelectItem key={story.key}>{story.label}</SelectItem>}
        </Select>
      </div>

      <div className="pt-6">
        <div className="flex flex-row ">
          <div
            className={cn(
              "relative flex h-full w-96 max-w-[384px] flex-1 flex-col !border-r-small border-divider pr-6 transition-[transform,opacity,margin] duration-250 ease-in-out",
            )}
            id="menu"
          >
            <header className="flex items-center text-md font-medium text-default-500 group-data-[selected=true]:text-foreground">
              <Icon
                className="text-default-500 mr-2"
                icon="solar:clipboard-text-outline"
                width={24}
              />
              Chapters
            </header>
<ScrollShadow
  className="max-h-[calc(500px)] -mr-4"
  id="menu-scroll"
>
  <div className="flex flex-col gap-4 py-3 pr-4">
    {chapters.map((chapter, idx) => (
      <Card
        key={`chapter-${idx}`}
        isPressable
        onClick={() => setSelectedChapterIdx(idx)}
        className={`max-w-[384px] border-1 border-divider/15 ${
          idx === selectedChapterIdx ? "bg-themeBlue/20" : ""
        }`}
        shadow="none"
      >
        <CardHeader className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <Chip
              className="mr-1 text-themeBlue bg-themeBlue/20"
              radius="sm"
              size="sm"
              variant="flat"
            >
              {idx === selectedChapterIdx ? "Editing" : `Chapter ${idx + 1}`}
            </Chip>
            <p className="text-left mr-1">{chapter.title}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className="line-clamp-2">
            {chapter.content.substring(0, 100)}...
          </p>
        </CardBody>
      </Card>
    ))}
  </div>
</ScrollShadow>

          </div>

          <div className="w-full flex-1 flex-col min-w-[600px] pl-4">
            <div className="flex flex-col">
              <header className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <Button isIconOnly size="sm" variant="light">
                    <Icon
                      className="hideTooltip text-default-500"
                      height={24}
                      icon="solar:sidebar-minimalistic-outline"
                      width={24}
                    />
                  </Button>
                  <h4 className="text-md">
  {chapters[selectedChapterIdx]?.title ?? "No Chapter Selected"}
</h4>

                  <div className="flex gap-3 pb-4">
  <Button
    size="sm"
    variant="ghost"
    onClick={handleInsertSplitMarker}
    startContent={<Icon icon="ph:scissors-duotone" />}
  >
    Insert Chapter Split
  </Button>
  <Button
    size="sm"
    variant="flat"
    onClick={handleSplitChapter}
    startContent={<Icon icon="material-symbols:split" />}
  >
    Split
  </Button>
  <Button
  size="sm"
  variant="bordered"
  onClick={handleMergeWithNext}
  startContent={<Icon icon="mdi:merge" />}
>
  Combine with Next Chapter
</Button>

</div>

                </div>
              </header>
              <div className="w-full flex-1 flex-col min-w-[400px]">
                <div className={cn("flex flex-col gap-4")}>
                  <div className="flex flex-col items-start">
                    <div className="relative mb-5 w-full h-[400px] bg-slate-50 dark:bg-gray-800 rounded-lg">
                      <div className="absolute inset-x-4 top-4 z-10 flex justify-between items-center">
                        <div className="flex justify-between">
                          <Button
                            className="mr-2 bg-white dark:bg-gray-700"
                            size="sm"
                            startContent={
                              <Icon
                                className="text-default-500"
                                icon="ant-design:highlight-outlined"
                                width={24}
                              />
                            }
                            variant="flat"
                          >
                            button-1
                          </Button>
                        </div>

                        <Button
                          className="mr-2 bg-white dark:bg-gray-700"
                          size="sm"
                          startContent={
                            <Icon
                              className="text-default-500"
                              icon="material-symbols:save-outline"
                              width={24}
                            />
                          }
                          variant="flat"
                        >
                          button-2
                        </Button>
                      </div>
                      <div>
                        <ScrollShadow className="editScrollShow absolute left-2 right-2 bottom-10 top-12 text-base p-3 resize-none rounded-md border-solid border-inherit bg-slate-50 dark:bg-gray-800">
                          <div className="flex w-full h-full bg-slate-50 dark:bg-gray-200 rounded-lg p-2">
                            {/* Adjusted to use flex display for layout */}
<textarea
  ref={textareaRef}
  className="flex-1 p-3 resize-none rounded-md border border-gray-300 bg-white dark:bg-gray-200 text-gray-900"
  value={chapters[selectedChapterIdx]?.content ?? ""}
  onChange={(e) => {
    const updatedChapters = [...chapters];
    updatedChapters[selectedChapterIdx] = {
      ...updatedChapters[selectedChapterIdx],
      content: e.target.value,
    };
    setChapters(updatedChapters);
  }}
/>


                            <div className="bg-gray-100 p-1 rounded-md self-end ml-2">
                              {/* Added margin-left to separate from textarea, align-self to position at the bottom */}
                            </div>
                          </div>
                        </ScrollShadow>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
