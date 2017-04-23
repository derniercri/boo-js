// @flow

import type { $Request, $Response } from 'express';

export default (address: string) => {
  return {
    getAll: (req: $Request, res: $Response) => {
      res.send({ address: address });
    },
  }
}
