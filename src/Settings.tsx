// @ts-nocheck
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Checkbox, FormControlLabel, FormGroup, Slider } from "@mui/material";
import { Container } from "@mui/system";

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const JLPTCheck = ({ level, localSettings, setLocalSettings }) => {
  return (
    <FormControlLabel
      checked={localSettings.jlpt.indexOf(level) != -1}
      control={
        <Checkbox
          onChange={(e) => {
            setLocalSettings({
              ...localSettings,
              jlpt: e.target.checked
                ? [...localSettings.jlpt, level]
                : removeItem(localSettings.jlpt, level),
            });
          }}
          defaultChecked
        />
      }
      label={`N${level}`}
    />
  );
};

export default function Settings({ handleClose, open, settings, setSettings }) {
  const minDistance = 5;

  const [value1, setValue1] = React.useState<number[]>([20, 37]);

  const [localSettings, setLocalSettings] = React.useState({
    jlpt: [],
    percentStart: 0,
    percentEnd: 10,
  });

  React.useEffect(() => {
    setLocalSettings(settings);
    setValue1([settings.percentStart, settings.percentEnd]);
  }, [settings]);

  const handleChange1 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
    setLocalSettings({
      jlpt: localSettings.jlpt,
      percentStart: value1[0],
      percentEnd: value1[1],
    });
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Settings
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={() => {
                setSettings(localSettings);
                handleClose();
              }}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>

        <Container>
          <br />
          <Typography variant="h5">JLPT Levels</Typography>
          <FormGroup>
            <JLPTCheck
              level={5}
              localSettings={localSettings}
              setLocalSettings={setLocalSettings}
            />
            <JLPTCheck
              level={4}
              localSettings={localSettings}
              setLocalSettings={setLocalSettings}
            />
            <JLPTCheck
              level={3}
              localSettings={localSettings}
              setLocalSettings={setLocalSettings}
            />
            <JLPTCheck
              level={2}
              localSettings={localSettings}
              setLocalSettings={setLocalSettings}
            />
            <JLPTCheck
              level={1}
              localSettings={localSettings}
              setLocalSettings={setLocalSettings}
            />
          </FormGroup>
          <br />

          <Typography variant="h5">Study Range Percentage</Typography>
          <Slider
            step={5}
            marks
            value={value1}
            onChange={handleChange1}
            valueLabelDisplay="auto"
            disableSwap
          />
        </Container>
      </Dialog>
    </div>
  );
}
