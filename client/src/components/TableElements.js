import React, { useState, useEffect, useRef, useContext } from "react";
import { SiteContext } from "../Context";
import { Link, useHistory } from "react-router-dom";
import { camelize } from "./FormElements";

export const Sidebar = ({ views, children }) => {
  const { sidebarSize, setSidebarSize } = useContext(SiteContext);
  const history = useHistory();
  const onResize = () =>
    window.innerWidth <= 1080 ? setSidebarSize("mini") : setSidebarSize("full");
  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.addEventListener("resize", onResize);
  }, []);
  function switchView(e) {
    Array.from(e.target.parentElement.children).forEach((element) => {
      element.classList.contains("active") &&
        element.classList.remove("active");
    });
    e.target.classList.add("active");
  }
  return (
    <div className={`sidebar ${sidebarSize}`}>
      {children}
      <ul className="viewList">
        {views.map((view) => {
          return (
            <li
              onClick={() =>
                window.innerWidth <= 1080 && setSidebarSize("mini")
              }
              key={view.label}
              className={
                history.location.pathname.startsWith(view.path) ? "active" : ""
              }
            >
              <Link to={view.path} onClick={switchView}>
                <ion-icon name={`${view.icon}${"-outline"}`}></ion-icon>
                <span>{view.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="backdrop" onClick={() => setSidebarSize("mini")}></div>
    </div>
  );
};

export const Filter = ({ categories, filters, setFilters }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [value, setValue] = useState("");
  const [showMiniForm, setShowMiniForm] = useState(false);
  const [miniForm, setMiniForm] = useState({ name: "", input: "" });
  const filterInput = useRef();
  const input = useRef();
  function change(e) {
    setValue(e.target.value);
    e.target.value !== "" && !showCategories && setShowCategories(true);
  }
  function submit(e) {
    e.preventDefault();
    if (filters.title) {
      return;
    }
    addChip("title", value);
    setValue("");
    filterInput.current.focus();
    setShowCategories(false);
  }
  function miniFormSubmit(e) {
    e.preventDefault();
    if (filters[miniForm.name]) {
      // --------- NEED LOOKUP
      return;
    }
    addChip(miniForm.name, e.target.querySelector("input").value);
    setValue("");
    setShowCategories(false);
  }
  function suggestionClick(e, item) {
    setMiniForm(item);
    setShowMiniForm(true);
  }
  function addChip(category, value) {
    setFilters((prev) => {
      const newChips = { ...prev };
      newChips[category] = value;
      return newChips;
    });
    setShowCategories(false);
  }
  useEffect(() => {
    !showCategories && setShowMiniForm(false);
  }, [showCategories]);
  return (
    <div className="tableFilter">
      <form onSubmit={submit}>
        <ion-icon
          onClick={() => filterInput.current.focus()}
          name="filter-outline"
        ></ion-icon>
        <div className="chips">
          {Object.entries(filters).map((item, i) => (
            <div key={item[1]} className="chip">
              <p>
                {item[0]} contains '<b>{item[1]}</b>'
              </p>
              <ion-icon
                onClick={() =>
                  setFilters((prev) => {
                    const newChips = { ...prev };
                    delete newChips[item[0]];
                    return newChips;
                  })
                }
                name="close-outline"
              ></ion-icon>
            </div>
          ))}
          <input
            ref={filterInput}
            value={value}
            onChange={change}
            onFocus={() => setShowCategories(true)}
            placeholder="Filter"
          />
        </div>
        {Object.values(filters).length > 0 && (
          <ion-icon
            onClick={() => setFilters({})}
            name="close-outline"
          ></ion-icon>
        )}
      </form>
      {showCategories && (
        <OutsideClick open={showCategories} setOpen={setShowCategories}>
          <ul
            className="filterSuggestions"
            style={{
              left: filterInput.current.offsetLeft + 8,
              top: filterInput.current.offsetTop + 40,
            }}
          >
            {!showMiniForm ? (
              <>
                {value === "" &&
                  categories
                    .filter((item) => !filters[item.name])
                    .map((item) => (
                      <li
                        key={item.name}
                        onClick={(e) => suggestionClick(e, item)}
                      >
                        {item.name}
                      </li>
                    ))}
                {value !== "" && !filters.title && (
                  <li onClick={submit}>
                    Title contains '<b>{value}</b>'
                  </li>
                )}
                {value !== "" &&
                  categories
                    .filter((item) => !filters[item.name])
                    .filter((item) => item.name.includes(value.toLowerCase()))
                    .map((item, i) => (
                      <React.Fragment key={item.name}>
                        {i === 0 && <hr />}
                        <li onClick={(e) => suggestionClick(e, item)}>
                          {item.name}
                        </li>
                      </React.Fragment>
                    ))}
                {value !== "" &&
                  categories.filter((item) =>
                    item.name.includes(value.toLowerCase())
                  ).length === 0 &&
                  filters.title && (
                    <li className="noFilter">No matching filter</li>
                  )}
              </>
            ) : (
              <div className="miniForm">
                <header>
                  <p>{miniForm.name}</p>
                  <ion-icon
                    onClick={() => {
                      setShowCategories(false);
                    }}
                    name="close-outline"
                  ></ion-icon>
                </header>
                <form onSubmit={miniFormSubmit}>
                  {miniForm.input}
                  <button type="submit">APPLY</button>
                </form>
              </div>
            )}
          </ul>
        </OutsideClick>
      )}
    </div>
  );
};

export const Tabs = ({ tabs, defaultTab, page }) => {
  const history = useHistory();
  const currentPath = history.location.pathname.replace(page, "").split("/")[0];
  const [index, setIndex] = useState(() => {
    let index = 0;
    tabs.forEach((item, i) => camelize(item) === currentPath && (index = i));
    return index;
  });

  function switchTab(e) {
    Array.from(e.target.parentElement.children).forEach((element) => {
      element.classList.contains("active") &&
        element.classList.remove("active");
    });
    e.target.classList.add("active");
    Array.from(e.target.parentElement.children).forEach((element, i) => {
      element.classList.contains("active") && setIndex(i);
    });
  }
  return (
    <ul className="tabs">
      {tabs.map((tab, i) => (
        <Link
          key={tab}
          className={i === index ? "active" : ""}
          onClick={switchTab}
          to={`${page}${camelize(tab)}`}
        >
          {tab}
        </Link>
      ))}
      <span
        style={{
          left: `${(100 / tabs.length) * index}%`,
          width: `${100 / tabs.length}%`,
        }}
      ></span>
    </ul>
  );
};

export const Table = ({ id, children, columns, setSort, sort, className }) => {
  return (
    <table id={id} className={className}>
      {columns && (
        <thead>
          <tr>
            {columns.map((col) =>
              !col.sort ? (
                <th key={col.column}>{col.column}</th>
              ) : (
                <th key={col.column}>
                  <button
                    className={sort.column === col.colCode ? "active" : ""}
                    onClick={() =>
                      setSort((prev) => {
                        const newSort = { ...prev };
                        if (newSort.column === col.colCode) {
                          newSort.order = prev.order === "asc" ? "des" : "asc";
                          return newSort;
                        } else {
                          newSort.column = col.colCode;
                          newSort.order = "des";
                          return newSort;
                        }
                      })
                    }
                  >
                    {col.column}
                    {sort.column === col.colCode &&
                      (sort.order === "des" ? (
                        <ion-icon name="arrow-down-outline"></ion-icon>
                      ) : (
                        <ion-icon name="arrow-up-outline"></ion-icon>
                      ))}
                  </button>
                </th>
              )
            )}
          </tr>
        </thead>
      )}
      {children && <tbody>{children}</tbody>}
    </table>
  );
};

export const OutsideClick = ({ children, setOpen, open }) => {
  return (
    <div>
      {open && (
        <div
          className="backdrop"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        />
      )}
      {children}
    </div>
  );
};

export const Actions = ({ id, actions }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="actions" onClick={() => setOpen(true)}>
      <ion-icon name="chevron-down-outline"></ion-icon>
      {open && (
        <OutsideClick open={open} setOpen={setOpen}>
          <ul>
            {actions.map((item) => (
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  item.action();
                  setOpen(false);
                }}
                key={item.option}
              >
                {item.option}
              </li>
            ))}
          </ul>
        </OutsideClick>
      )}
    </div>
  );
};

const encodeURL = (obj) =>
  Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join("&");

export const LoadingColumn = () => {
  return (
    <tr className="loadingColumn">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  );
};

export const View = ({
  id,
  api,
  categories,
  columns,
  defaultSort,
  Element,
}) => {
  const abortController = new AbortController();
  const signal = abortController.signal;
  const { locale } = useContext(SiteContext);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(defaultSort);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  function fetchData() {
    !loading && setLoading(true);
    const query = encodeURL(filters);
    const sortOrder = encodeURL(sort);
    const options = { headers: { "Accept-Language": locale }, signal: signal };
    const url = `/${api}${query}&${sortOrder}`;
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log("handle error!!");
      });
    return () => abortController.abort();
  }
  useEffect(fetchData, [filters, sort, api]);
  return (
    <>
      {categories && (
        <Filter
          filters={filters}
          setFilters={setFilters}
          categories={categories}
        />
      )}
      <Table
        id={id}
        className="thead"
        sort={sort}
        setSort={setSort}
        columns={columns}
      />
      <Table id={id} sort={sort} setSort={setSort}>
        {loading ? (
          <LoadingColumn />
        ) : (
          data.map((item) => (
            <Element setData={setData} key={item._id} data={item} />
          ))
        )}
      </Table>
    </>
  );
};
