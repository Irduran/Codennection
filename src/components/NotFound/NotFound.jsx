import React from 'react'
import { useNavigate } from 'react-router-dom'

export const NotFound = () => {

    const navigate = useNavigate();

    const goHome = () =>{
        navigate('/')
    }
  return (
    <>
    <StarryBackground />
    <div className="d-flex align-items-center justify-content-center m-5">
            <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3"> <span className="text-danger">Opps!</span> Page not found.</p>
                <p className="lead">
                    The page youre looking for doesnt exist.
                </p>
                <a className="btn btn-primary"
                    onClick={goHome}>Go Home</a>
            </div>
        </div>
    </>
  )
}
