// @ts-nocheck

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { Grid, IconButton } from "@mui/material";
import jvoc from "./jvoc.json";
import KanjiCard from "./KanjiCard";
import {
  Fireplace,
  Shuffle,
  ShuffleOnOutlined,
  TuneOutlined,
  Visibility,
} from "@mui/icons-material";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Settings from "./Settings";

type VisibilityStates = "visible" | "hideWord" | "hideDetails";

function shuffle(input) {
  var array = [...input];
  var m = array.length,
    t,
    i;
  var seed = 42;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(random(seed) * m--); // <-- MODIFIED LINE

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed; // <-- ADDED LINE
  }

  return array;
}

function random(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const days = (date_1, date_2) => {
  let difference = date_1.getTime() - date_2.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
};

const todayMidnight = () => {
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const calculateStreak = (today) => {
  // const today = new Date();
  const storedDate = localStorage.getItem("streak_date")
    ? new Date(localStorage.getItem("streak_date"))
    : todayMidnight();
  let streakDays = parseInt(localStorage.getItem("streak_days")) || 0;
  const ndays = days(today, storedDate);
  localStorage.setItem("streak_date", today);

  console.log(ndays);

  if (ndays == 0) {
    return streakDays;
  } else if (ndays == 1) {
    streakDays += 1;
  } else {
    console.log("Streak Reset", ndays);
    localStorage.removeItem("streak_date");
    streakDays = 0;
  }
  localStorage.setItem("streak_days", streakDays);
  return streakDays;
};

const usePersistedState = (defaultValue, localStorageKey) => {
  const [value, setValue] = React.useState(() => {
    const localStorageItem = localStorage.getItem(localStorageKey);
    if (localStorageItem === null) return defaultValue;
    try {
      return JSON.parse(localStorageItem);
    } catch (err) {
      return defaultValue;
    }
  });

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
};

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number; total: number }
) {
  return (
    <div className="progress">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2">{`${Math.round(
            (props.value / props.total) * 100
          )}% ${props.value}/${props.total} `}</Typography>
        </Box>
      </Box>
    </div>
  );
}

export default function App(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [shuffled, setShuffled] = React.useState(false);

  const [settings, setSettings] = usePersistedState(
    {
      jlpt: [5],
      percentStart: 0,
      percentEnd: 10,
      voType: "all",
    },
    "settings"
  );

  const [notes, setNotes] = usePersistedState({}, "notes");
  const [knows, setKnows] = usePersistedState({}, "knows");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [visbility, setVisibility] =
    React.useState<VisibilityStates>("visible");

  const toggleVisibility = (visbility: string) => {
    return () => {
      if (visbility === "visible") setVisibility("hideDetails");
      else if (visbility === "hideDetails") setVisibility("hideWord");
      else setVisibility("visible");
    };
  };

  const __cards = jvoc.filter((card, i) => settings.jlpt.indexOf(card.j) != -1);

  const _cards = __cards
    .filter(
      (_, i) =>
        i >= ~~((__cards.length * settings.percentStart) / 100) &&
        i <= ~~((__cards.length * settings.percentEnd) / 100)
    )
    .filter((c) => {
      if (settings.voType === "kanji") return c.c === "k";
      else if (settings.voType === "word") return c.c === "w";
      else return true;
    });
  const cards = shuffled ? shuffle(_cards) : _cards;

  const knowsCount = cards.filter((x) => knows[x.w]).length;
  const streak = calculateStreak(addDays(todayMidnight()));
  return (
    <>
      <CssBaseline />

      <Settings
        handleClose={handleClose}
        open={open}
        settings={settings}
        setSettings={setSettings}
      />
      <AppBar style={{ background: "black " }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            玉子
          </Typography>
          <LinearProgressWithLabel value={knowsCount} total={cards.length} />

          <IconButton
            size="large"
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 12,
            }}
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Fireplace />
            <span>{streak} Days</span>
          </IconButton>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              setShuffled(!shuffled);
            }}
          >
            {shuffled ? <ShuffleOnOutlined /> : <Shuffle />}
          </IconButton>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleVisibility(visbility)}
          >
            <Visibility />
          </IconButton>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleOpen}
          >
            <TuneOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container fixed>
        <br />

        <Grid container spacing={{ xs: 3, md: 3 }}>
          {cards.map((voc, index) => (
            <Grid item xs={12} sm={12} md={6} key={index}>
              <KanjiCard
                key={index}
                voc={voc}
                showWord={visbility !== "hideWord"}
                showDetails={visbility !== "hideDetails"}
                notes={notes}
                setNotes={setNotes}
                knows={knows}
                setKnows={setKnows}
              />
            </Grid>
          ))}
        </Grid>
        <br />
        <br />
        <br />
      </Container>
    </>
  );
}
