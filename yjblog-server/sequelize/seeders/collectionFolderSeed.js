'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const CF = []
        for(let i = 1;i<=5;i++){
            const nowId = uuidv4()
            CF.push({
                id:nowId,
                name:`文件夹${i}`,
                authId:4,
                createdAt:new Date(),
                updatedAt:new Date(),
                fatherId:null
            })
            for(let j =1;j<=5;j++){
                const sonId = uuidv4()
                CF.push({
                    id:sonId,
                    name:`文件夹${i}-${j}`,
                    authId:4,
                    createdAt:new Date(),
                    updatedAt:new Date(),   
                    fatherId:nowId
                })
            }
        }
        await queryInterface.bulkInsert('collection_folder', CF, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('collection_folder', null, {});
    }
};
