import mongoose from "mongoose";
import { Schema } from "mongoose";
import Tester from '@/model/testerModel';
import Creator from '@/model/creatorModel';
import Survey from "@/model/Task/surveytaskModel";
import { NextResponse } from "next/server";
import taskModel from "@/model/taskModel";

export async function POST (req){

    const reqBody = await req.json();


    if(!reqBody)
    {
        return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
    }
    const { creator, post_date, end_date, tester_no, tester_age, tester_gender,country,heading,instruction,noOfQuestions,questions} = reqBody;
    
    if(!creator || !post_date || !end_date || !tester_no || !tester_age || !tester_gender || !country || !heading || !instruction || !noOfQuestions || !questions)
    {
        return NextResponse.json({ message: 'Invalid request body', reqBody }, { status: 400 });
    }

    const creatorExists = await Creator.findById(creator);
    if(!creatorExists)
    {
        return NextResponse.json({ message: 'Creator not found', creator }, { status: 404 });
    }


    if(noOfQuestions !== questions.length)
    {
        return NextResponse.json({ message: 'Number of questions does not match', noOfQuestions, questions }, { status: 400 });
    }
    const p_date = new Date(post_date)
    const e_date = new Date(end_date)
    const survey = new Survey({
        creator:new mongoose.Types.ObjectId(creator),
        post_date :p_date,
        end_date: e_date,
        tester_no,
        tester_age,
        tester_gender,
        country,
        heading,
        instruction,
        noOfQuestions,
        questions
    });
    const current_date = new Date();
    let task_flag = "Pending";
    if(current_date >= p_date && current_date <= e_date){
        task_flag = "Open";
    }
    else if(current_date <= p_date) {
        task_flag = "Pending";
    }
    else{
        task_flag = "Closed";
    }
    const result = await survey.save();
    const task = new taskModel({
        type : 'survey',
        survey : result._id,
        task_flag
    });
    await task.save();
    
    creatorExists.taskHistory.push({
        task : task._id,
    });
    await creatorExists.save();

    return NextResponse.json({ message: 'Survey created successfully', result }, { status: 201 });
}