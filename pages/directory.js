import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import InputBase from "@mui/material/InputBase"
import IconButton from "@mui/material/IconButton"
import SearchIcon from "@mui/icons-material/Search"
import Pagination from "@mui/material/Pagination"
import Modal from "@mui/material/Modal"
import styled from "styled-components"

export async function getServerSideProps() {
  const response = await fetch(`${process.env.API_URL}/api/category`)
  const json = await response.json()
  const availableCategories = json.data
  // setAvailableCategories(json.data)

  // Pass data to the page via props
  return { props: { availableCategories } }
}

function DirectoryPage({ availableCategories }) {
  const [category, setCategory] = useState("")
  // const [availableCategories, setAvailableCategories] = useState([])
  const [listings, setListings] = useState([])
  const [limit, setLimit] = useState(20)
  const [offset, setOffset] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [paginatorCount, setPaginatorCount] = useState(0)
  const [page, setPage] = React.useState(1)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    async function fetchListings() {
      const queryString = new URLSearchParams({
        Limit: limit,
        Offset: offset,
        Categories: category,
        SearchTermA: searchTerm,
      }).toString()
      const response = await fetch(`/api/directory?${queryString}`)
      const json = await response.json()
      json.data ? setListings(json.data) : setListings([])
      setPaginatorCount(Math.ceil(json.count / limit))
    }
    fetchListings()
  }, [limit, offset, category, searchTerm])

  // useEffect(() => {
  //   async function fetchCategories() {
  //     const response = await fetch(`/api/category`)
  //     const json = await response.json()
  //     setAvailableCategories(json.data)
  //   }

  //   fetchCategories()
  // }, [])

  const handleChange = (event) => {
    setOffset(0)
    setPage(1)
    setCategory(event.target.value)
  }
  const handleClose = (event) => {
    setOpen(false)
  }

  const handlePaging = (event, value) => {
    setPage(value)
    setOffset((value - 1) * limit)
  }

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
    setOpen(true)
  }

  const handleSearch = (term) => {
    setOffset(0)
    setSearchTerm(term)
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    padding: "20px",
    background: "#fff",
    boxShadow: 24,
    p: 4,
  }

  const Paginator = styled.div`
    display: flex;
    justify-content: center;
  `

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {listings[selectedIndex]?.businessname}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {listings[selectedIndex]?.description}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            <b>Category: </b> {listings[selectedIndex]?.category}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            <b>Website: </b>{" "}
            <a href={listings[selectedIndex]?.website}>
              {listings[selectedIndex]?.website}
            </a>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            <b>Facebook: </b>{" "}
            <a href={listings[selectedIndex]?.facebookpage}>
              {listings[selectedIndex]?.facebookpage}
            </a>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            <b>Telephone: </b> {listings[selectedIndex]?.phonenumber}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            <b>Address: </b> {listings[selectedIndex]?.streetaddress}
          </Typography>
        </Box>
      </Modal>
      <Box sx={{ minWidth: 120, margin: "20px" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Listings"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              inputProps={{ "aria-label": "search categories" }}
              style={{ width: "90%" }}
            />
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Categories</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Categories"
                onChange={handleChange}
              >
                {availableCategories.map((availableCategory) => {
                  return (
                    <MenuItem
                      key={availableCategory.category}
                      value={availableCategory.category}
                    >
                      {availableCategory.category}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Divider style={{ marginTop: "50px" }} />
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {listings.map((listing, index) => {
            return (
              <ListItemButton
                key={index}
                alignItems="flex-start"
                selected={selectedIndex === index}
                onClick={(event) => handleListItemClick(event, index)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={`https://dittofi.com/409/iapi/v1/PromoImage/${listing.id}/`}
                  >
                    <a href={listing.website}></a>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={listing.businessname}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {listing.description}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItemButton>
            )
          })}
        </List>
        <Paginator>
          <Pagination
            count={paginatorCount}
            color="secondary"
            onChange={handlePaging}
            page={page}
          />
        </Paginator>
      </Box>
    </>
  )
}

export default DirectoryPage
