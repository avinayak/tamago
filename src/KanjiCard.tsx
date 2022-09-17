// @ts-nocheck

import * as React from "react";

import {
  Avatar,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Typography,
} from "@mui/material";

import { pink } from "@mui/material/colors";
import {
  ThumbDown,
  ThumbUp,
  ThumbUpAltOutlined,
  CampaignOutlined,
} from "@mui/icons-material";
import BasicMenu from "./BasicMenu";

type JVoc = {
  i: number;
  w: string;
  m: string;
  k: string;
  o: string;
  kw: string;
  e: string | undefined;
  c: "k" | "w";
  wt: string | undefined;
  j: number;
  s: number;
};

function TabLink({ url, text }: { url: string; text: string }) {
  return (
    <MenuItem
      onClick={() => {
        window.open(url, "_blank");
      }}
    >
      {text}
    </MenuItem>
  );
}

function speak(word) {
  if ("speechSynthesis" in window) {
    let utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ja";
    speechSynthesis.speak(utterance);
  } else {
    alert("Speech Synthesis is not Supported 😞");
  }
}

function SpeakMenu({ word }: { word: string }) {
  return (
    <MenuItem
      onClick={() => {
        speak(word);
      }}
    >
      Speak
    </MenuItem>
  );
}

function AddNote({ setNotes, word, notes }: { word: string }) {
  return (
    <MenuItem
      onClick={() => {
        setNotes({
          ...notes,
          [word]: "Edit this note..",
        });
      }}
    >
      Add Note
    </MenuItem>
  );
}

function stringLengthToFontSize(word: string): number {
  return 70 / Math.exp(word.length / 5);
}

function JLPTChip({ jlpt }: { jlpt: number }) {
  return (
    <Chip
      style={{ marginTop: 4 }}
      avatar={
        <Avatar
          sx={{ bgcolor: pink[100 * (6 - jlpt)] }}
          style={{ color: jlpt < 3 ? "white" : "black" }}
        >
          {jlpt}
        </Avatar>
      }
      label="JLPT"
      variant="outlined"
    />
  );
}

export default function KanjiCard({
  voc,
  showWord,
  showDetails,
  notes,
  setNotes,
  knows,
  setKnows,
}: {
  voc: JVoc;
  showWord: boolean;
  showDetails: boolean;
}) {
  const [visibilityOverride, setVisibilityOverride] = React.useState(false);

  React.useEffect(() => {
    setVisibilityOverride(true);
  }, [showWord]);

  const pronounciation = [voc.k, voc.o]
    .filter((w) => w !== "" && w)
    .join(" • ")
    .trim();

  let knowButton = <ThumbUpAltOutlined />;
  if (knows[voc.w]) {
    knowButton = <ThumbUp color="success" />;
  } else if (knows[voc.w] == false) {
    knowButton = <ThumbDown color="error" />;
  }

  return (
    <div className="paper">
      <Grid container spacing={0}>
        <Grid
          item
          xs={4}
          style={{
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <div
            className={visibilityOverride && !showWord && "hidden"}
            onClick={() => {
              setVisibilityOverride(!visibilityOverride);
            }}
            style={{
              fontSize: stringLengthToFontSize(voc.w),
              userSelect: "none",
            }}
          >
            <span style={{ opacity: visibilityOverride && !showWord ? 0 : 1 }}>
              {voc.w}
            </span>
          </div>
        </Grid>
        <Grid item xs={8} style={{ paddingLeft: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {`#${voc.i} - `}
              {voc.c === "k" ? "Kanji " : "Word "}
            </Typography>

            <span>
              <IconButton
                aria-label="edit note"
                size="large"
                onClick={() => {
                  speak(voc.w);
                }}
              >
                <CampaignOutlined />
              </IconButton>

              <IconButton
                aria-label="edit note"
                size="large"
                onClick={() => {
                  if (knows[voc.w]) {
                    setKnows({
                      ...knows,
                      [voc.w]: false,
                    });
                  } else if (knows[voc.w] == false) {
                    const { [voc.w]: _, ...knowsW } = knows;
                    setKnows(knowsW);
                  } else {
                    setKnows({
                      ...knows,
                      [voc.w]: true,
                    });
                  }
                }}
              >
                {knowButton}
              </IconButton>

              <BasicMenu>
                <SpeakMenu word={voc.w} />
                {voc.c === "k" && (
                  <TabLink
                    text="Hochanh / Koohii"
                    url={`https://hochanh.github.io/rtk/${voc.w}/index.html`}
                  />
                )}
                <TabLink
                  text="Jisho"
                  url={`https://jisho.org/search/${voc.w}`}
                />

                <AddNote setNotes={setNotes} notes={notes} word={voc.w} />
              </BasicMenu>
            </span>
          </div>
          <div style={{ userSelect: "none" }}>
            <div
              className={visibilityOverride && !showDetails && "hidden"}
              onClick={() => {
                setVisibilityOverride(!visibilityOverride);
              }}
            >
              <Typography
                variant="h5"
                component="div"
                style={{
                  margin: "8px 0px",
                  opacity: visibilityOverride && !showDetails ? 0 : 1,
                }}
              >
                {pronounciation !== "" ? pronounciation : voc.w}
              </Typography>

              <Typography
                variant="subtitle1"
                style={{
                  margin: "8px 0px",
                  opacity: visibilityOverride && !showDetails ? 0 : 1,
                }}
              >
                {[voc.kw, voc.m, voc.e]
                  .filter((w) => w !== "" && w)
                  .join(" / ")}
              </Typography>
            </div>

            {notes[voc.w] && (
              <textarea
                defaultValue={notes[voc.w]}
                onBlur={(e) => {
                  if (e.currentTarget.value === "") {
                    const { [voc.w]: _, ...notesW } = notes;
                    setNotes(notesW);
                  } else
                    setNotes({
                      ...notes,
                      [voc.w]: e.currentTarget.value,
                    });
                }}
                style={{
                  width: "100%",
                  background: pink[50],
                  border: "none",
                  marginBottom: 16,
                  borderRadius: 8,
                  fontSize: 10,
                  padding: 8,
                }}
                variant="outlined"
              />
            )}
            <div>
              {
                <>
                  {[
                    ...(voc.wt
                      ? voc.wt.split(",").map((e) => (
                          <>
                            <Chip label={e.trim()} variant="outlined" />{" "}
                          </>
                        ))
                      : []),
                    <JLPTChip jlpt={voc.j} />,
                  ]}

                  <br />
                  <br />
                </>
              }
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
