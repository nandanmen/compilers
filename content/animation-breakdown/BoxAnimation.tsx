import { styled } from "@/stitches";
import { motion } from "framer-motion";

export function BoxAnimation() {
  return (
    <Wrapper>
      <Initial initial={{ x: 150 }} />
      <Line
        animate={{ scaleX: 1 }}
        initial={{ scaleX: 0 }}
        transition={{ delay: 1, duration: 1 }}
      />
      <Distance
        style={{ x: "calc(-100% - 8px)" }}
        animate={{ opacity: 1, y: 2 }}
        initial={{ opacity: 0, y: 16 }}
        transition={{ delay: 2 }}
      >
        500px
      </Distance>
      <Box
        initial={{ x: 150 }}
        animate={{ x: 800 }}
        transition={{ duration: 1 }}
      />
    </Wrapper>
  );
}

const Wrapper = styled("div", {
  position: "relative",
});

const Line = styled(motion.div, {
  position: "absolute",
  width: 650,
  left: 150,
  height: "2px",
  background: "$mint9",
  top: "50%",
  transformOrigin: "left",
});

const Distance = styled(motion.p, {
  position: "absolute",
  top: "50%",
  left: 800,
  fontFamily: "$mono",
});

const Initial = styled(motion.div, {
  "--borderStyle": "dashed",
  width: "$40",
  aspectRatio: 1,
  border: "2px var(--borderStyle) $colors$mint9",
  borderRadius: "8px",
});

const Box = styled(Initial, {
  "--borderStyle": "solid",
  border: "2px var(--borderStyle) $colors$mint9",
  background: "linear-gradient(45deg, $colors$mint7, $colors$mint9)",
  position: "absolute",
  top: 0,
});
