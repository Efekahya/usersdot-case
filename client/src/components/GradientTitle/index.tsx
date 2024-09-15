import { Text } from "@mantine/core";
import { gradientTitle } from "./styles.module.css";

interface GradientTitleProps {
  title: string;
}

const GradientTitle = ({ title }: GradientTitleProps) => (
  <Text size="32px" className={gradientTitle}>
    {title}
  </Text>
);

export default GradientTitle;
