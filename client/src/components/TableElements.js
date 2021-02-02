import React, { useState, useEffect, useRef, useContext } from "react";
import { SiteContext } from "../Context";
import { Link, useHistory } from "react-router-dom";
import { Combobox } from "./FormElements";
import { FormattedMessage, FormattedNumber, injectIntl } from "react-intl";
import Footer from "./Footer";

export const Sidebar = ({ views, children }) => {
  const { sidebarSize, setSidebarSize } = useContext(SiteContext);
  const history = useHistory();
  const onResize = () =>
    window.innerWidth <= 1080 ? setSidebarSize("mini") : setSidebarSize("full");
  function initResize() {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.addEventListener("resize", onResize);
  }
  useEffect(initResize, []);
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
              key={Math.random()}
              onClick={() =>
                window.innerWidth <= 1080 && setSidebarSize("mini")
              }
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
      <Footer />
      <div className="backdrop" onClick={() => setSidebarSize("mini")}></div>
    </div>
  );
};

export const Filter = ({ categories, filters, setFilters }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [value, setValue] = useState("");
  const [showMiniForm, setShowMiniForm] = useState(false);
  const [miniForm, setMiniForm] = useState({ name: "", input: "" });
  const [defaultFilter, setDefaultFilter] = useState({});
  const filterInput = useRef();
  const input = useRef();
  function change(e) {
    setValue(e.target.value);
    e.target.value !== "" && !showCategories && setShowCategories(true);
  }
  function submit(e) {
    e.preventDefault();
    if (filters.some((item) => item.field === defaultFilter.fieldName)) {
      return;
    }
    addFilter(defaultFilter.fieldName, value, defaultFilter.chip);
    setValue("");
    filterInput.current.focus();
    setShowCategories(false);
  }
  function miniFormSubmit(e) {
    e.preventDefault();
    addFilter(
      miniForm.fieldName,
      e.target.querySelector("input").value,
      miniForm.chip
    );
    setValue("");
    setShowCategories(false);
  }
  function suggestionClick(e, item) {
    setMiniForm(item);
    setShowMiniForm(true);
  }
  function addFilter(field, value, chip) {
    setFilters((prev) => {
      const newFilters = [...prev];
      newFilters.push({
        field: field,
        value: value,
        chip: chip,
      });
      return newFilters;
    });
    setShowCategories(false);
  }
  useEffect(() => {
    !showCategories && setShowMiniForm(false);
  }, [showCategories]);
  useEffect(() => {
    categories.forEach((item) => {
      item.default && setDefaultFilter(item);
    });
  }, [categories]);
  return (
    <div className="tableFilter">
      <form onSubmit={submit}>
        <ion-icon
          onClick={() => filterInput.current.focus()}
          name="filter-outline"
        ></ion-icon>
        <div className="chips">
          {filters.map((item, i) => {
            return (
              <div key={item.field} className="chip">
                <p>
                  {item.chip} '<b>{item.value}</b>'
                </p>
                <ion-icon
                  onClick={() =>
                    setFilters((prev) => {
                      return prev.filter((i) => i.field !== item.field);
                    })
                  }
                  name="close-outline"
                ></ion-icon>
              </div>
            );
          })}
          <FormattedMessage id="filter">
            {(msg) => (
              <input
                ref={filterInput}
                value={value}
                onChange={change}
                onFocus={() => setShowCategories(true)}
                placeholder={msg}
              />
            )}
          </FormattedMessage>
        </div>
        {Object.values(filters).length > 0 && (
          <ion-icon
            onClick={() => setFilters([])}
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
                    .filter(
                      (item) =>
                        !filters.some(
                          (filter) => filter.field === item.fieldName
                        )
                    )
                    .map((item) => (
                      <li
                        key={item.name}
                        onClick={(e) => suggestionClick(e, item)}
                      >
                        {item.name}
                      </li>
                    ))}
                {value !== "" &&
                  !filters.some(
                    (item) => item.field === defaultFilter.fieldName
                  ) && (
                    <li onClick={submit}>
                      {defaultFilter.chip} '<b>{value}</b>'
                    </li>
                  )}
                {value !== "" &&
                  categories
                    .filter(
                      (item) =>
                        !filters.some(
                          (filter) => filter.field === item.fieldName
                        )
                    )
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
                  categories
                    .filter(
                      (item) =>
                        !filters.some(
                          (filter) => filter.field === item.fieldName
                        )
                    )
                    .filter((item) => item.name.includes(value.toLowerCase()))
                    .length === 0 &&
                  filters.some(
                    (item) => item.field === defaultFilter.fieldName
                  ) && <li className="noFilter">No matching filter</li>}
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
    tabs.forEach((item, i) => item.link === currentPath && (index = i));
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
          key={tab.link}
          className={i === index ? "active" : ""}
          onClick={switchTab}
          to={`${page}${tab.link}`}
        >
          {tab.label}
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
                <th key={Math.random()}>{col.column}</th>
              ) : (
                <th key={Math.random()}>
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

export const OutsideClick = ({
  id,
  className,
  style,
  children,
  setOpen,
  open,
}) => {
  return (
    <section className={className} style={style} id={id}>
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
    </section>
  );
};

export const Actions = ({ actions, icon }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="actions" onClick={() => setOpen(true)}>
      <ion-icon name={icon || `chevron-down-outline`}></ion-icon>
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
                key={item.label}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </OutsideClick>
      )}
    </div>
  );
};

const encodeURI = (arr) =>
  arr.map((item) => `${item.field}=${item.value}`).join("&");

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

export const ErrorColumn = () => {
  return (
    <tr>
      <td>Some thing went wrong!</td>
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
  const [filters, setFilters] = useState([]);
  const [sort, setSort] = useState(defaultSort);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  function fetchData() {
    !loading && setLoading(true);
    const query = encodeURI(filters);
    const options = { headers: { "Accept-Language": locale }, signal: signal };
    const url = `/${api}${query}&column=${sort.column}&order=${sort.order}`;
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          setData(data.data);
        } else {
          alert("something went wrong");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.name === "AbortError") {
          console.log("aborted by user");
          return;
        }
        console.log(err);
        alert("something went wrong");
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
        {loading && <LoadingColumn />}
        {!loading &&
          data.map((item) => (
            <Element setData={setData} key={item._id} data={item} />
          ))}
        {!loading && data.length === 0 && <NothingHere />}
      </Table>
    </>
  );
};

export const ViewPaginated = injectIntl(
  ({ id, api, categories, columns, defaultSort, Element, intl }) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const { locale } = useContext(SiteContext);
    const [filters, setFilters] = useState([]);
    const [sort, setSort] = useState(defaultSort);
    const [data, setData] = useState([]);
    const [perPage, setPerPage] = useState(20);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    function fetchData() {
      !loading && setLoading(true);
      const query = encodeURI(filters);
      const options = {
        headers: { "Accept-Language": locale },
        signal: signal,
      };
      const url = `/${api}${query}&column=${sort.column}&order=${sort.order}&perPage=${perPage}&page=${currentPage}`;
      fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.code === "ok") {
            setData(data.content);
            setTotal(data.total);
          } else {
            alert("something went wrong");
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.name === "AbortError") {
            return;
          }
          console.log(err);
          alert("something went wrong");
        });
      return () => abortController.abort();
    }
    useEffect(fetchData, [filters, sort, api, perPage, currentPage, locale]);
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
          {loading && <LoadingColumn />}
          {!loading &&
            data.map((item) => (
              <Element setData={setData} key={item._id} data={item} />
            ))}
          {!loading && data.length === 0 && <NothingHere />}
        </Table>
        <div className="tableFooter">
          {loading ? (
            <div className="loading">
              <span />
              <span />
              <span />
            </div>
          ) : (
            data.length > 0 && (
              <>
                <div className="perPage">
                  <p className="count">
                    <FormattedMessage id="perPage" />
                  </p>
                  <Combobox
                    icon="caret-down"
                    options={[
                      { label: intl.formatNumber(20), value: 20 },
                      { label: intl.formatNumber(30), value: 30 },
                      { label: intl.formatNumber(50), value: 50 },
                    ]}
                    defaultValue={perPage === 20 ? 0 : perPage === 30 ? 1 : 2}
                    maxHeight={96}
                    onChange={(option) => {
                      setPerPage(option.value);
                    }}
                  />
                </div>
                <p className="count">
                  <FormattedMessage
                    id="itemCount"
                    values={{
                      start: (
                        <FormattedNumber
                          value={(currentPage - 1) * perPage + 1}
                        />
                      ),
                      end: (
                        <FormattedNumber
                          value={Math.min(currentPage * perPage, total)}
                        />
                      ),
                      total: <FormattedNumber value={total} />,
                    }}
                  />
                </p>
                <div className="btns">
                  <button disabled={loading || currentPage === 1}>
                    <ion-icon
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      name="chevron-back-outline"
                    ></ion-icon>
                  </button>
                  <button disabled={loading || total / perPage < currentPage}>
                    <ion-icon
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      name="chevron-forward-outline"
                    ></ion-icon>
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </>
    );
  }
);

export const LoadingPost = () => {
  return (
    <div className="question loading">
      <div className="user"></div>
      <div className="ques"></div>
      <div className="tags"></div>
    </div>
  );
};
export const NothingHere = ({ icon }) => {
  return (
    <tr className="noData">
      <td>
        <ion-icon name="trail-sign-outline"></ion-icon> -{" "}
        <FormattedMessage id="nothingHere" defaultMessage="Nothing here" /> -
      </td>
    </tr>
  );
};
