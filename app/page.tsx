"use client";

import { useState } from "react";
import { read, utils } from "xlsx";
export interface TreeNode {
  id: string | number;
  qty: number;
  part: string;
  children?: TreeNode[];
}

export default function Home() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  function getTree(rows: string[]) {
    const tree: TreeNode[] = [];
    rows.forEach((el) => {
      const id = el[0];
      const part = el[1];
      const qty = Number(el[2]);

      const [first, second, third, forth] = id.split(".");
      const firstLevEL = tree.find((r: TreeNode) => r.id === first);
      if (!firstLevEL) tree.push({ id: first, qty, part });
      const secondLevEL = firstLevEL?.children?.find((r) => r.id === second);

      if (second) {
        if (!secondLevEL)
          firstLevEL!.children = [
            ...(firstLevEL?.children || []),
            { id: second, qty, part },
          ];
      }
      const thirdLevEL = secondLevEL?.children?.find((r) => r.id === third);
      if (third) {
        if (!thirdLevEL)
          secondLevEL!.children = [
            ...(secondLevEL?.children || []),
            { id: third, qty, part },
          ];
      }
      const forthLevEL = thirdLevEL?.children?.find((r) => r.id === forth);
      if (forth) {
        if (!forthLevEL)
          thirdLevEL!.children = [
            ...(thirdLevEL?.children || []),
            { id: forth, qty, part },
          ];
      }
    });
    setTree(tree);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    const data = await file?.arrayBuffer();
    const workbook = read(data);
    const worksheet = workbook.Sheets["Sheet1"]; // Adjust the sheet name as needed
    const rows = utils.sheet_to_json(worksheet, { header: 1 }) as string[];
    getTree(rows);
  }

  return (
    <main className="">
      {!tree.length ? (
        <div className="h-screen grid justify-center items-center ">
          <input
            type="file"
            name="file"
            accept="xlsx"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <ul className="grid">
          {tree.map(({ id: id0, part, qty, children: children0 }) => (
            <li key={id0} className="grid gap-1 h-[280mm] grid-rows-4 ">
              <span className="grid text-center bg-[#4472c4] rounded-md">
                <span className="my-auto font-bold ">{`${id0}. (${part}) Qty: ${qty}`}</span>
              </span>
              <ul className="grid grid-flow-col gap-1  row-span-3 ">
                {children0 ? (
                  children0?.map(
                    ({ id: id1, part, qty, children: children1 }) => (
                      <li key={id1} className="grow grid grid-rows-3 gap-1 ">
                        <span className="grid text-center bg-[#ed7d31] max-h-64 rounded-md">
                          <span className="m-auto font-bold texto text-xs leading-3 text-nowrap">{`${id0}.${id1}. (${part}) Qty: ${qty}`}</span>
                        </span>
                        <ul className="grid grid-flow-col gap-1 row-span-2">
                          {children1 ? (
                            children1.map(
                              ({ id: id2, part, qty, children: children2 }) => (
                                <li
                                  key={id2}
                                  className="grow grid gap-1 grid-rows-2 "
                                >
                                  <span className="grid text-center bg-[#a5a5a5] max-h-64 rounded-md">
                                    <span className="m-auto font-bold texto text-xs leading-3 text-nowrap ">{`${id0}.${id1}.${id2}. (${part}) Qty: ${qty}`}</span>
                                  </span>
                                  <ul className="grid grid-flow-col gap-[2px]">
                                    {children2 ? (
                                      children2.map(
                                        ({ id: id3, part, qty }) => (
                                          <li
                                            key={id3}
                                            className="grow grid gap-1"
                                          >
                                            <span className="grid text-center bg-[#ffc000] max-h-64 rounded-md">
                                              <span className="m-auto font-bold texto text-xs leading-3 text-nowrap ">{`${id0}.${id1}.${id2}.${id3}. (${part}) Qty: ${qty}`}</span>
                                            </span>
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <span className="h-24" />
                                    )}
                                  </ul>
                                </li>
                              )
                            )
                          ) : (
                            <span className="h-24" />
                          )}
                        </ul>
                      </li>
                    )
                  )
                ) : (
                  <span className="h-24" />
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
