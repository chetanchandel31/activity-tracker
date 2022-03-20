import { Path } from "../constants";

/**
 * @param path - any valid path for activity tracker
 * @param pathname - `pathname` property of value returned by `useLocation`
 *
 * @returns  is current route same as `path`
 */
export const isSelected = (path: Path, pathname: string) =>
  pathname.includes(path);
