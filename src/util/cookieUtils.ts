import { NextFunction, Request, Response } from 'express'

const setAccessTokenCookie = (res: Response, accessToken: string) => {
    res.cookie('accessToken', accessToken, {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
    });
  };
  
  export default setAccessTokenCookie;