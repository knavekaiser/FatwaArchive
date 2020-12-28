import React from "react";
import "./CSS/About.min.css";
import { Route, Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Modal } from "./Modals";
import bkash from "../naeem_bKash.jpg";

function About({ history }) {
  const closeModal = () => {
    history.push(`/about`);
  };
  return (
    <div className="main about">
      <h3>পরিচিতি</h3>
      <br />
      <p className="artcl">
        বর্তমানে ইসলামিক বিভিন্ন সমস্যার সমাধান আমরা অনলাইনে খোঁজাখুঁজি করি,
        কিন্তু ইন্টারনেটে সঠিক ইসলাম খোঁজা হয়ে উঠতে পারে খড়-কুটোর ঝোপে সূচ
        খোঁজার ন্যায় । আর বাংলা ভাষার সার্চেতো উত্তর পাওয়া আরো দুরূহ ব্যাপার
        হয়ে দাঁড়ায় ।
      </p>
      <p className="artcl">
        যদিও আল কাউসার, আহলে হক মিডিয়ার মত অনেকেই কাজ করছেন, কিন্তু SEO না
        থাকায় গুগল থেকে সরাসরি তা পাওয়া যায় না । যে সকল জামিয়ার ওয়েবসাইট আছে
        তারাও সঙ্গত কারণেই যেটুকু সময় প্রয়োজন তা দিতে পারেন না ।
      </p>
      <p className="artcl">
        এই সকল সমস্যার সমাধানে আমাদের কিঞ্চিৎ প্রয়াস <b>ফতোয়া আর্কাইভ</b> ।
        <b> ফতোয়া আর্কাইভ</b> হক্কানী উলামায়ে কেরামের তত্ত্বাবধানে পরিচালিত
        একটি ফতোয়া সংকলন ওয়েবসাইট ।
      </p>
      <br />
      <hr />
      <br />
      <br />
      <h3>কার্যক্রমঃ</h3>
      <br />
      <div className="activities">
        <h4>ফতোয়া প্রকাশ - </h4>
        <p className="artcl">
          ফতোয়া আর্কাইভের ক্রমবর্ধমান লাইব্রেরীতে পাবেন প্রয়োজনীয় সকল ফতোয়া
          । নামাজ, রোজা, হজ্জ থেকে শুরু করে ইতিহাস, সভ্যতা, সংস্কৃতি সহ যেকোনো
          বিষয় । এই জ্ঞান ভান্ডার থেকে খুঁজে নিন আপনার সমস্যার সমাধান । অথবা
          সূচিপত্র ব্রাউজ করুন জ্ঞানের পিয়াসে ।
        </p>
        <h4>প্রশ্নের উত্তরে ফতোয়া প্রদান -</h4>
        <p className="artcl">
          সাম্প্রতিক, ঐতিহাসিক, আগ্রহ, কৌতূহল বা আপনার যেকোনো সমস্যার শরয়ী
          সমাধান পেতে প্রশ্নটি লিখে সাবমিট করুন । অভিজ্ঞ মুফতিয়ানে কেরাম যথাযথ
          গবেষণার মাধ্যমে তার সঠিক উত্তর দেবেন । ফতোয়া প্রকাশের ক্ষেত্রে অবশ্যই
          আপনার নাম সহ সকল ব্যাক্তিগত তথ্য উহ্য রাখা হবে ।
        </p>
        <h4>ফতোয়ার উৎস - </h4>
        <p className="artcl">
          ফতোয়া আর্কাইভে দেশের প্রখ্যাত জামিয়ার ফতোয়া বিভাগ থেকে ফতোয়া
          প্রদান করা হয় । ফতোয়া প্রদানের ক্ষেত্রে জামিয়া বা মুফতি সাহেব
          রেজিষ্ট্রেশন ফর্ম যথাযথভাবে পুরন করে রেজিষ্ট্রেশন করবেন । অতঃপর
          নিজেদের লাইব্রেরী থেকে অথবা ফতোয়া আর্কাইভের ইউজারদের সাবমিট করা
          প্রশ্নের উত্তরে ফতোয়া প্রদান করবেন । প্রকাশের ক্ষেত্রে যিনি এই
          ফতোয়ার লেখক বা যে জামিয়া থেকে তা পোস্ট করা হয়েছে সবার যথাযথ মর্যাদা
          রেখেই প্রকাশ করা হবে ।
        </p>
        <h4>ফতোয়া সংরক্ষণ - </h4>
        <p className="artcl">
          বাংলাদেশের সকল ইফতা বিভাগের স্বতন্ত্র ওয়েবসাইট নেই । আর ফতোয়া
          আর্কাইভ সকল ফতোয়া সংরক্ষণের একটি চমৎকার উপায় । আর তা ছাড়া দিন রাত
          এক করে গবেষণা করা ফতোয়া কোনো একটা তালাবদ্ধ সেলফে পরে থাকার সার্থকতা
          কোথায় । কিন্তু ফতোয়া যদি অনলাইনে থাকে তবে তা থেকে মানুষ উপকৃত হতেই
          থাকবে ।
        </p>
        <br />
      </div>
      <p className="closer">
        এই কাজের সাথে সংশ্লিষ্ট সকলকে আল্লাহ কবুল করুন এবং উত্তম বদলা দান করুন ।
        আমিন ।
      </p>
      <br />
      <br />
      <hr />
      <br />
      <br />
      <h3>সদস্যবৃন্দ - </h3>
      <br />
      <ul className="contacts">
        <li>
          <div className="icon">
            <ion-icon name="book-outline"></ion-icon>
          </div>
          <div className="body">
            <p className="name">মুফতি আব্দুর রহমান আব্দে রাব্বি</p>
            <div className="links">
              <a href="mailto:arabderabbi@gmail.com">
                <ion-icon name="mail-outline"></ion-icon>
              </a>
              <a href="tel:+8801305487161">
                <ion-icon name="call-outline"></ion-icon>
              </a>
            </div>
          </div>
        </li>
        <li>
          <div className="icon">
            <ion-icon name="hammer-outline"></ion-icon>
          </div>
          <div className="body">
            <p className="name">নাঈম আহমাদ</p>
            <div className="links">
              <a href="mailto:naeem.ahmad.9m@gmail.com">
                <ion-icon name="mail-outline"></ion-icon>
              </a>
              <a href="tel:+8801989479749">
                <ion-icon name="call-outline"></ion-icon>
              </a>
            </div>
          </div>
        </li>
      </ul>
      <br />
      <br />
      <hr />
      <br />
      <br />
      <h2>ফতোয়া আর্কাইভ</h2>
      <p>কামরাঙ্গীরচর, ঢাকা </p>
      <br />
      <Link className="donate" to={"/about/donate"}>
        <ion-icon name="umbrella-outline"></ion-icon>
      </Link>
      <br />
      <Route path="/about/donate">
        {
          <Modal containerClass="donate" open={true} setOpen={closeModal}>
            <img src={bkash} alt="bKash qr code for donation." />
          </Modal>
        }
      </Route>
    </div>
  );
}
export default About;
