import * as bookcarsHelper from ':bookcars-helper'

const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

/** Avoids `[joinURL] part undefined` when filename is missing (e.g. new car with no image). */
export function carCdnUrl(cdnBase: string, filename: string | undefined | null): string {
  if (!filename?.trim() || !cdnBase) {
    return TRANSPARENT_PIXEL
  }
  return bookcarsHelper.joinURL(cdnBase, filename)
}
