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

      const [first, second, third, forth, fifth] = id.split(".");
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
      const fifthLevEL = forthLevEL?.children?.find((r) => r.id === fifth);
      if (fifth) {
        if (!fifthLevEL)
          forthLevEL!.children = [
            ...(forthLevEL?.children || []),
            { id: fifth, qty, part },
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
    getTree(rows.filter((el) => el.length));
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
          {tree.map(({ id: id0, part, qty, children: children0 }) => {
            return (
              <li
                key={id0}
                className="grid gap-1 h-screen grid-rows-[40px_1fr] 0 "
              >
                <span className="grid text-center bg-[#4472c4] rounded-md">
                  <span className="my-auto font-bold ">{`${id0}. (${part}) Qty: ${qty}`}</span>
                </span>
                <ul className="grid grid-flow-col gap-1 ">
                  {children0 ? (
                    children0?.map(
                      ({ id: id1, part, qty, children: children1 }) => {
                        return (
                          <li
                            key={id1}
                            className="grow grid grid-rows-[220px_1fr] gap-1 1"
                          >
                            <span className="grid text-center bg-[#ed7d31] rounded-md">
                              <span className="m-auto font-bold texto text-xs leading-3 text-wrap">{`${id0}.${id1}. (${part}) Qty: ${qty}`}</span>
                            </span>
                            <ul className="grid grid-flow-col gap-1">
                              {children1 ? (
                                children1.map(
                                  ({
                                    id: id2,
                                    part,
                                    qty,
                                    children: children2,
                                  }) => {
                                    return (
                                      <li
                                        key={id2}
                                        className="grow grid gap-1 grid-rows-[280px_1fr] 2"
                                      >
                                        <span className="grid text-center bg-[#a5a5a5] rounded-md ">
                                          <span className="m-auto font-bold texto text-xs leading-3 text-wrap ">{`${id0}.${id1}.${id2}. (${part}) Qty: ${qty}`}</span>
                                        </span>
                                        <ul className="grid grid-flow-col gap-[2px]">
                                          {children2 ? (
                                            children2.map(
                                              ({
                                                id: id3,
                                                part,
                                                qty,
                                                children: children3,
                                              }) => {
                                                return (
                                                  <li
                                                    key={id3}
                                                    className="grow grid gap-1 grid-rows-[200px_1fr] 3"
                                                  >
                                                    <span className="grid text-center bg-[#ffc000] rounded-md">
                                                      <span className="m-auto font-bold texto text-[9px] leading-3 text-nowrap ">{`${id0}.${id1}.${id2}.${id3}. (${part}) Qty: ${qty}`}</span>
                                                    </span>
                                                    <ul className="grid grid-flow-col gap-[2px]">
                                                      {children3 ? (
                                                        children3.map(
                                                          ({
                                                            id: id4,
                                                            part,
                                                            qty,
                                                          }) => {
                                                            return (
                                                              <li
                                                                key={id4}
                                                                className="grow grid gap-1 grid-rows-[280px_1fr] 4"
                                                              >
                                                                <span className="grid text-center bg-[#d322d3] rounded-md">
                                                                  <span className="m-auto font-bold texto text-xs leading-3 text-nowrap ">{`${id0}.${id1}.${id2}.${id3}.${id4}. (${part}) Qty: ${qty}`}</span>
                                                                </span>
                                                              </li>
                                                            );
                                                          }
                                                        )
                                                      ) : (
                                                        <span className="h-24" />
                                                      )}
                                                    </ul>
                                                  </li>
                                                );
                                              }
                                            )
                                          ) : (
                                            <span className="h-24" />
                                          )}
                                        </ul>
                                      </li>
                                    );
                                  }
                                )
                              ) : (
                                <span className="h-24" />
                              )}
                            </ul>
                          </li>
                        );
                      }
                    )
                  ) : (
                    <span className="h-24" />
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
