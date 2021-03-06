﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEndApi.DAL;
using BackEndApi.Services.Templates;
using BackEndApi.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DinkToPdf.Contracts;
using DinkToPdf;

namespace BackEndApi
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<AppDBContext>(opt =>
                opt.UseInMemoryDatabase("AppDBContext"));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // Add converter to DI
            services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));

            services.AddScoped<ITemplateService, TemplateService>();
            // Add HtmlToPdf service to DI
            services.AddScoped<IHtmlToPdfService, HtmlToPdfService>();

            services.AddSingleton<IConfigurationRoot>(provider => Configuration);

            services.AddScoped<INotificationService, NotificationService>();
            services.AddTransient<IEmailSender, EmailSender>();
            services.AddTransient<ISMSSender, SMSSender>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IConfigurationRoot configurationRoot)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
